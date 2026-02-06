import { google } from "googleapis";
import type { Booking } from "@shared/schema";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

let calendarClient: ReturnType<typeof google.calendar> | null = null;

function getCalendarClient() {
  if (calendarClient) return calendarClient;

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!serviceAccountEmail || !privateKey) {
    throw new Error(
      "Google Calendar not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }

  const jwtClient = new google.auth.JWT(
    serviceAccountEmail,
    undefined,
    // When stored in env, newlines are often escaped as \n
    privateKey.replace(/\\n/g, "\n"),
    SCOPES,
  );

  calendarClient = google.calendar({ version: "v3", auth: jwtClient });
  return calendarClient;
}

function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)\s*godz/i);
  const minutesMatch = duration.match(/(\d+)\s*min/i);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

  // Fallback: if nothing parsed, assume 2 hours to avoid zero-length events
  if (hours === 0 && minutes === 0) {
    return 120;
  }

  return hours * 60 + minutes;
}

function getBookingDateTimes(booking: Pick<Booking, "date" | "time" | "duration">) {
  // booking.date: "YYYY-MM-DD", booking.time: "HH:MM"
  const start = new Date(`${booking.date}T${booking.time}:00`);
  const durationMinutes = parseDurationToMinutes(booking.duration as string);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const timeZone = process.env.BOOKING_TIMEZONE || "Europe/Warsaw";

  return { start, end, timeZone };
}

/**
 * Sprawdza w Google Calendar, czy dany slot (data + godzina + czas trwania)
 * jest wolny. Jeśli API nie jest skonfigurowane lub wystąpi błąd – zwraca true,
 * żeby nie blokować rezerwacji.
 */
export async function isSlotAvailableForBooking(
  booking: Pick<Booking, "date" | "time" | "duration">,
): Promise<boolean> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    console.warn(
      "GOOGLE_CALENDAR_ID not set. Skipping Google Calendar availability check.",
    );
    return true;
  }

  try {
    const calendar = getCalendarClient();
    const { start, end, timeZone } = getBookingDateTimes(booking);

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone,
        items: [{ id: calendarId }],
      },
    });

    const busy =
      res.data.calendars?.[calendarId]?.busy ??
      (Array.isArray((res.data as any).busy)
        ? ((res.data as any).busy as any[])
        : []);

    return !busy || busy.length === 0;
  } catch (error) {
    console.error("Google Calendar free/busy check failed:", error);
    // Nie blokujemy rezerwacji, jeśli kalendarz jest chwilowo niedostępny
    return true;
  }
}

/**
 * Create a Google Calendar event for a confirmed booking.
 * Best-effort: any errors should be handled by the caller and not break the booking itself.
 */
export async function createCalendarEventForBooking(booking: Booking): Promise<void> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) {
    console.warn(
      "GOOGLE_CALENDAR_ID not set. Skipping Google Calendar event creation.",
    );
    return;
  }

  const calendar = getCalendarClient();
  const { start, end, timeZone } = getBookingDateTimes(booking);

  const descriptionLines = [
    `Klient: ${booking.firstName} ${booking.lastName}`,
    `Telefon: ${booking.phone}`,
    `E-mail: ${booking.email}`,
    `Adres: ${booking.address}`,
  ];

  if (booking.additionalInfo) {
    descriptionLines.push(`Dodatkowe informacje: ${booking.additionalInfo}`);
  }

  try {
    await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `Sprzątanie: ${booking.service}`,
        description: descriptionLines.join("\n"),
        start: {
          dateTime: start.toISOString(),
          timeZone,
        },
        end: {
          dateTime: end.toISOString(),
          timeZone,
        },
      },
    });
  } catch (error: any) {
    throw error;
  }
}

