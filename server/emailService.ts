// server/emailService.ts
// Node 18+ (global fetch). Если Node < 18 — дам вариант с node-fetch.

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const MAIL_FROM = process.env.MAIL_FROM || "no-reply@example.com";
const MAIL_TO_ADMIN = process.env.MAIL_TO_ADMIN || "admin@example.com";

if (!BREVO_API_KEY) {
  console.warn("[brevo] Missing BREVO_API_KEY");
}
if (!MAIL_TO_ADMIN || MAIL_TO_ADMIN === "admin@example.com") {
  console.warn("[brevo] MAIL_TO_ADMIN is missing or default. Admin notifications may fail.");
}


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
  price?: string | number;     // "320"  320
  duration?: string | number;  // "3h"  180
  createdAt?: string;
  notes?: string;
};


async function brevoSendEmail(opts: {
  to: { email: string; name?: string }[];
  subject: string;
  html: string;
  text?: string;
  bcc?: { email: string; name?: string }[];
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
      bcc: opts.bcc,
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


export async function testEmailConnection() {
  const r = await fetch("https://api.brevo.com/v3/smtp/statistics/events?limit=1", {
    headers: { "api-key": BREVO_API_KEY, accept: "application/json" },
  });
  if (!r.ok) {
    throw new Error(`Brevo status: ${r.status}`);
  }
}


export async function sendCustomerConfirmation(b: Booking) {
  if (!b.email) return;
  const subject = `Potwierdzenie rezerwacji — ${safe(b.service)}`;
  const html = renderCustomerHtml(b);
  const text = renderTextFallback(b);

  await brevoSendEmail({
    to: [{ email: b.email, name: [b.firstName, b.lastName].filter(Boolean).join(" ") }],
    subject,
    html,
    text,

  });
  console.log(`[brevo] Customer email sent to ${b.email}${MAIL_TO_ADMIN && MAIL_TO_ADMIN !== "admin@example.com" ? ` (bcc: ${MAIL_TO_ADMIN})` : ""}`);
}


export async function sendBusinessNotification(b: Booking) {
  if (!MAIL_TO_ADMIN || MAIL_TO_ADMIN === "admin@example.com") {
    throw new Error("[brevo] MAIL_TO_ADMIN not configured");
  }
  const subject = `🧹 Nowa rezerwacja: ${safe(b.service)} — ${fmt(b.date)} ${fmt(b.time)}`;
  const html = renderAdminHtml(b);
  const text = renderTextFallback(b);

  await brevoSendEmail({
    to: [{ email: MAIL_TO_ADMIN, name: "Admin" }],
    subject,
    html,
    text,
  });
  console.log(`[brevo] Admin email sent to ${MAIL_TO_ADMIN}`);
}


function renderCustomerHtml(b: Booking) {
  const price = (b.price ?? "-").toString();
  const duration = (b.duration ?? "-").toString();

  return `
<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Potwierdzenie rezerwacji</title>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
          <!-- Header -->
          <tr>
            <td style="background:#3b5bdb;color:#ffffff;padding:28px 32px;text-align:center;">
              <div style="font-size:28px;line-height:1.1;font-weight:800;margin-bottom:4px;">SprzątanieMieszkań.com</div>
              <div style="opacity:.9;font-size:13px;">Potwierdzenie rezerwacji</div>
            </td>
          </tr>

          <!-- Success bar -->
          <tr>
            <td style="padding:20px 24px 0;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e6f9ec;border:1px solid #b7efc5;border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;font-size:14px;color:#14532d;">
                    ✅ <strong>Dziękujemy! Twoja rezerwacja została przyjęta.</strong><br/>
                    <span style="opacity:.9;">Numer rezerwacji: <strong>#${(b.id || "").slice(0,8)}</strong></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:16px 24px 8px;">
              <div style="font-size:16px;font-weight:700;margin:12px 0 6px;">Szczegóły usługi</div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 8px;">
                ${row("Usługa:", escapeHtml(b.service))}
                ${row("Metraż:", escapeHtml(b.area ? "do " + b.area.replace(/\\D/g,"") + " m²" : "—"))}
                ${row("Mycie okien:", labelWindow(b.windowOption))}
                ${row("Data i godzina:", `${escapeHtml(b.date || "-")}, ${escapeHtml(b.time || "-")}`)}
                ${row("Czas trwania:", humanDuration(duration))}
                ${row("Cena całkowita:", `<span style="display:inline-block;font-weight:800;font-size:22px;color:#15803d;">${formatPLN(price)}</span>`)}
                ${row("Adres:", joinAddr(b))}
                ${b.notes ? row("Uwagi:", escapeHtml(b.notes)) : ""}
              </table>
            </td>
          </tr>

          <!-- Next -->
          <tr>
            <td style="padding:8px 24px 8px;">
              <div style="font-size:16px;font-weight:700;margin:12px 0 6px;">Co dalej?</div>
              <ul style="margin:6px 0 0 18px;padding:0;font-size:14px;color:#374151;">
                <li>Skontaktujemy się dzień przed wizytą, aby potwierdzić szczegóły.</li>
                <li>Nasz zespół przyjedzie punktualnie w wyznaczonym terminie.</li>
                <li>Płatność po wykonaniu usługi (gotówka lub przelew).</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 24px 28px;border-top:1px solid #eef2f7;text-align:center;font-size:13px;color:#6b7280;">
              <div style="margin-bottom:6px;">
                <a href="tel:+48123456789" style="color:#3b5bdb;text-decoration:none;">+48 512 266 221</a>
                ·
                <a href="mailto:kontakt@sprzataniemieszkan.pl" style="color:#3b5bdb;text-decoration:none;">kontakt@sprzataniemieszkan.pl</a>
              </div>
              <div>SprzątanieMieszkań.com — Profesjonalne sprzątanie mieszkań w Warszawie</div>
            </td>
          </tr>
        </table>
        <div style="font-size:11px;color:#9aa3af;margin-top:10px;">Jeśli to nie Twoja rezerwacja, zignoruj tę wiadomość.</div>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function renderAdminHtml(b: Booking) {
  return `
<!doctype html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06);">
          <tr><td style="background:#3b5bdb;color:#fff;padding:24px 28px;text-align:center;">
            <div style="font-size:22px;font-weight:800;">Nowa rezerwacja</div>
            <div style="opacity:.9;font-size:13px;">${escapeHtml(b.service)} — ${escapeHtml(b.date||"-")} ${escapeHtml(b.time||"")}</div>
          </td></tr>
          <tr><td style="padding:16px 24px 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 8px;">
              ${row("Usługa:", escapeHtml(b.service))}
              ${row("Obszar:", escapeHtml(b.area))}
              ${row("Okna:", labelWindow(b.windowOption))}
              ${row("Adres:", joinAddr(b))}
              ${row("Cena / czas:", `${formatPLN(b.price ?? "-")} · ${humanDuration(String(b.duration ?? "-"))}`)}
              ${row("Klient:", `${escapeHtml([b.firstName,b.lastName].filter(Boolean).join(" ")||"-")} (${escapeHtml(b.email||"-")}${b.phone? ", "+escapeHtml(b.phone):""})`)}
              ${b.notes ? row("Uwagi:", escapeHtml(b.notes)) : ""}
              ${row("ID:", escapeHtml(b.id || "-"))}
              ${row("Utworzono:", escapeHtml(b.createdAt || new Date().toISOString()))}
            </table>
          </td></tr>
          <tr><td style="padding:18px 24px 24px;border-top:1px solid #eef2f7;text-align:center;font-size:13px;color:#6b7280;">
            Panel: przekaż zlecenie brygadzie i potwierdź dzień wcześniej.
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
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

function safe(v?: string) {
  return (v || "").toString().replace(/[<>&]/g, s => ({ "<":"&lt;","&":"&amp;",">":"&gt;" }[s]!));
}
function fmt(v?: string) { return v || "-"; }
function parseFrom(v: string): { email: string; name?: string } {
  const m = v.match(/^(.*)<([^>]+)>$/);
  if (m) return { name: m[1].trim(), email: m[2].trim() };
  return { email: v.trim() };
}


function escapeHtml(v?: string) {
  return (v ?? "").toString().replace(/[<>&"]/g, s => ({ "<":"&lt;","&":"&amp;",">":"&gt;", "\"":"&quot;" }[s]!));
}
function formatPLN(v: string | number) {
  const n = Number(String(v).replace(/[^\d.,-]/g,"").replace(",","."));
  if (isNaN(n)) return escapeHtml(String(v));
  return new Intl.NumberFormat("pl-PL",{ style:"currency", currency:"PLN" }).format(n);
}
function labelWindow(opt?: "none"|"standard"|"nonStandard") {
  if (opt === "standard") return "Standardowe okna";
  if (opt === "nonStandard") return "Niestandardowe okna";
  return "—";
}
function humanDuration(v: string) {

  const num = Number(v);
  if (!isNaN(num)) {
    const h = Math.floor(num/60), m = num%60;
    return `${h} godz.${m? " " + m + " min" : ""}`;
  }
  return escapeHtml(v);
}
function joinAddr(b: Booking) {
  const a = [b.address, b.city, b.postalCode].filter(Boolean).map(escapeHtml);
  return a.length ? a.join(", ") : "—";
}
function row(label: string, value?: string) {
  return `
  <tr>
    <td style="width:180px;vertical-align:top;padding:10px 12px;background:#f9fafb;border:1px solid #eef2f7;border-right:none;border-radius:8px 0 0 8px;font-size:14px;color:#6b7280;">${label}</td>
    <td style="vertical-align:top;padding:10px 12px;background:#ffffff;border:1px solid #eef2f7;border-left:none;border-radius:0 8px 8px 0;font-size:14px;color:#111827;">${value ?? "—"}</td>
  </tr>`;
}
