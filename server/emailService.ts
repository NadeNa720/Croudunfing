// server/emailService.ts
// Node 18+ (global fetch). Если Node < 18 — скажи, дам вариант с node-fetch.

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const MAIL_FROM = process.env.MAIL_FROM || "no-reply@example.com";
const MAIL_TO_ADMIN = process.env.MAIL_TO_ADMIN || "admin@example.com";

if (!BREVO_API_KEY) {
  console.warn("[brevo] Missing BREVO_API_KEY");
}

/** Тип брони — максимально либеральный, чтобы не упасть, даже если поле отсутствует */
export type Booking = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  service?: string;            // "Sprzątanie po remoncie - Warszawa"
  area?: string;               // "warszawa" / "okolice" ...
  windowOption?: "none" | "standard" | "nonStandard";

  address?: string;
  city?: string;
  postalCode?: string;

  date?: string;               // "2025-10-20"
  time?: string;               // "14:00"
  price?: string | number;     // "320" или 320
  duration?: string | number;  // "3h" или 180
  createdAt?: string;
  notes?: string;
};

/* ================= Низкоуровневый вызов Brevo API ================= */
async function brevoSendEmail(opts: {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
}) {
  const sender = parseFrom(MAIL_FROM); // { email, name? }

  const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to: opts.to,
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => "");
    throw new Error(`[brevo] send failed: ${resp.status} ${err}`);
  }
}

/* ================= Внешние функции, которые использует routes.ts ================= */

/** Проверка связи при старте. Для Railway — просто быстрый ping к статусу Brevo. */
export async function testEmailConnection() {
  // Лёгкий GET на статус-заглушку. Если нужно — можно отправлять тестовое письмо.
  const r = await fetch("https://api.brevo.com/v3/smtp/statistics/events?limit=1", {
    headers: { "api-key": BREVO_API_KEY, accept: "application/json" },
  });
  if (!r.ok) {
    throw new Error(`Brevo status: ${r.status}`);
  }
}

/** Письмо клиенту (подтверждение брони) */
export async function sendCustomerConfirmation(b: Booking) {
  if (!b.email) return; // если клиент не указал email — пропустить
  const subject = `Potwierdzenie rezerwacji — ${safe(b.service)}`;
  const html = renderCustomerHtml(b);
  const text = renderTextFallback(b);

  await brevoSendEmail({
    to: [{ email: b.email, name: [b.firstName, b.lastName].filter(Boolean).join(" ") }],
    subject,
    html,
    text,
  });
}

/** Письмо админу (уведомление о новой брони) */
export async function sendBusinessNotification(b: Booking) {
  const subject = `🧹 Nowa rezerwacja: ${safe(b.service)} — ${fmt(b.date)} ${fmt(b.time)}`;
  const html = renderAdminHtml(b);
  const text = renderTextFallback(b);

  await brevoSendEmail({
    to: [{ email: MAIL_TO_ADMIN, name: "Admin" }],
    subject,
    html,
    text,
  });
}

/* ================= Шаблоны писем ================= */

function renderAdminHtml(b: Booking) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
    <h2>Nowa rezerwacja</h2>

    <p><b>Usługa:</b> ${safe(b.service)}</p>
    <p><b>Termin:</b> ${fmt(b.date)} ${fmt(b.time)}</p>
    <p><b>Obszar:</b> ${safe(b.area)} ${b.windowOption ? `(okna: ${b.windowOption})` : ""}</p>
    <p><b>Adres:</b> ${safe(b.address)}${b.city ? ", " + safe(b.city) : ""}${b.postalCode ? " " + safe(b.postalCode) : ""}</p>
    <p><b>Cena / czas:</b> ${b.price ?? "-"} / ${b.duration ?? "-"}</p>

    <hr style="margin:16px 0;border:none;border-top:1px solid #eee" />
    <p><b>Klient:</b> ${[b.firstName, b.lastName].filter(Boolean).join(" ") || "-"} (${safe(b.email)}${b.phone ? ", " + safe(b.phone) : ""})</p>
    ${b.notes ? `<p><b>Uwagi:</b> ${safe(b.notes)}</p>` : ""}
    ${b.id ? `<p><small>ID: ${safe(b.id)}</small></p>` : ""}
    <p><small>Utworzono: ${safe(b.createdAt || new Date().toISOString())}</small></p>
  </div>`;
}

function renderCustomerHtml(b: Booking) {
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
    <h2>Potwierdzenie rezerwacji</h2>
    <p>Dziękujemy za rezerwację w <b>SprzątanieMieszkań.com</b>.</p>

    <p><b>Usługa:</b> ${safe(b.service)}</p>
    <p><b>Termin:</b> ${fmt(b.date)} ${fmt(b.time)}</p>
    <p><b>Adres:</b> ${safe(b.address)}${b.city ? ", " + safe(b.city) : ""}${b.postalCode ? " " + safe(b.postalCode) : ""}</p>
    <p><b>Szac. cena / czas:</b> ${b.price ?? "-"} / ${b.duration ?? "-"}</p>

    <p style="margin-top:16px">Jeśli chcesz wprowadzić zmiany, odpowiedz na tę wiadomość lub zadzwoń: <a href="tel:+48123456789">+48 123 456 789</a>.</p>
  </div>`;
}

function renderTextFallback(b: Booking) {
  return `Rezerwacja:
Usługa: ${b.service || "-"}
Termin: ${fmt(b.date)} ${fmt(b.time)}
Obszar: ${b.area || "-"} ${b.windowOption ? "(okna: " + b.windowOption + ")" : ""}
Adres: ${b.address || "-"} ${b.city || ""} ${b.postalCode || ""}
Cena / czas: ${b.price ?? "-"} / ${b.duration ?? "-"}

Klient: ${[b.firstName, b.lastName].filter(Boolean).join(" ") || "-"} (${b.email || "-"}) ${b.phone || ""}
Uwagi: ${b.notes || "-"}
ID: ${b.id || "-"}
`;
}

/* ================= Утилиты ================= */
function safe(v?: string) {
  return (v || "").toString().replace(/[<>&]/g, s => ({ "<":"&lt;","&":"&amp;",">":"&gt;" }[s]!));
}
function fmt(v?: string) { return v || "-"; }
function parseFrom(v: string): { email: string; name?: string } {
  const m = v.match(/^(.*)<([^>]+)>$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { email: v.trim() };
}
