import { createCalendarEventForBooking } from "./googleCalendar";
import type { Booking } from "@shared/schema";

async function main() {
  // Prosta testowa rezerwacja, żeby sprawdzić integrację z Google Calendar
  const now = new Date();
  const date = now.toISOString().slice(0, 10); // YYYY-MM-DD

  const booking: Booking = {
    id: "test-booking-id",
    service: "Testowa usługa sprzątania",
    area: "do 30 m²",
    windowOption: null,
    date,
    time: "15:00", // ustaw ręcznie godzinę, jeśli chcesz inną
    firstName: "Test",
    lastName: "Klient",
    phone: "+48 000 000 000",
    email: "test@example.com",
    address: "Testowy adres 1, 00-000 Warszawa",
    additionalInfo: "Testowa rezerwacja utworzona ze skryptu",
    price: "100.00",
    duration: "2 godz.",
    createdAt: new Date(),
  };

  console.log("Tworzę wydarzenie w Google Calendar dla daty:", booking.date, "godzina:", booking.time);

  await createCalendarEventForBooking(booking);

  console.log("✅ Wydarzenie zostało utworzone. Sprawdź Google Calendar.");
}

main().catch((err) => {
  console.error("❌ Błąd podczas tworzenia wydarzenia:", err);
  process.exit(1);
});

