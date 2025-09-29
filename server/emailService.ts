import sgMail from '@sendgrid/mail';
import type { Booking } from '@shared/schema';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

function formatBookingForEmail(booking: Booking): string {
  return `
Szczegóły rezerwacji:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 Usługa: ${booking.service}
📐 Metraż: ${booking.area}
${booking.windowOption && booking.windowOption !== 'none' ? `🪟 Mycie okien: ${booking.windowOption === 'standard' ? 'Standardowe' : booking.windowOption === 'nonStandard' ? 'Niestandardowe' : 'Inne'}` : ''}
📅 Data: ${booking.date}
⏰ Godzina: ${booking.time}
⏱️ Czas trwania: ${booking.duration}
💰 Cena: ${booking.price} zł

👤 Dane kontaktowe:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Imię i nazwisko: ${booking.firstName} ${booking.lastName}
📞 Telefon: ${booking.phone}
📧 E-mail: ${booking.email}
🏠 Adres: ${booking.address}

${booking.additionalInfo ? `📝 Dodatkowe informacje:\n${booking.additionalInfo}` : ''}

Numer. rezerwacji: ${booking.id}
Data utworzenia: ${booking.createdAt ? new Date(booking.createdAt).toLocaleString('pl-PL') : 'Nie określono'}
  `.trim();
}

// универсальный отправитель
async function sendMail(to: string, subject: string, html: string, text?: string) {
  const msg = {
    to,
    from: process.env.MAIL_FROM!, // ВАЖНО: подтверждённый sender/domain
    subject,
    html,
    text,
  };
  const resp = await sgMail.send(msg);
  console.log('✅ SendGrid OK:', resp[0].statusCode, to);
}

// ретраи оставляем
async function retryEmailSend(sendFn: () => Promise<void>, maxRetries: number = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sendFn();
      return;
    } catch (error: any) {
      console.error(`❌ Email send attempt ${attempt} failed:`, error.response?.body || error.message);
      if (attempt === maxRetries) throw error;
      await new Promise(r => setTimeout(r, attempt * 1000));
    }
  }
}

export async function sendCustomerConfirmation(booking: Booking): Promise<void> {
  const subject = `Potwierdzenie rezerwacji #${booking.id.substring(0,8)} - SprzątanieMieszkań.com`;
  const html = customerHtml(booking);
  const text = formatBookingForEmail(booking);
  await retryEmailSend(() => sendMail(booking.email, subject, html, text));
}

export async function sendBusinessNotification(booking: Booking): Promise<void> {
  const to = process.env.BUSINESS_EMAIL || 'admin@example.com';
  const subject = `🆕 Nowa rezerwacja #${booking.id.substring(0,8)} - ${booking.firstName} ${booking.lastName}`;
  const html = adminHtml(booking);
  const text = formatBookingForEmail(booking);
  await retryEmailSend(() => sendMail(to, subject, html, text));
}
function formatPLN(price: number | string): string {

  const cleaned = String(price).replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? `${n.toFixed(2)} zł` : `${cleaned} zł`;
}



export async function testEmailConnection(): Promise<boolean> {
  try {
    await sgMail.send({
      to: process.env.BUSINESS_EMAIL || 'admin@example.com',
      from: process.env.MAIL_FROM!,
      subject: 'SendGrid check (sandbox)',
      html: '<p>OK</p>',
      mailSettings: { sandboxMode: { enable: true } }, // не отправит реальное письмо
    } as any);
    console.log('✅ SendGrid API reachable');
    return true;
  } catch (e: any) {
    console.error('❌ SendGrid test failed:', e.response?.body || e.message);
    return false;
  }
}
// -------- HTML шаблоны --------
function customerHtml(b: Booking) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
    <div style="padding:24px 24px 8px;text-align:center">
      <h1 style="margin:0;color:#2563eb;font-size:24px">SprzątanieMieszkań.com</h1>
      <p style="margin:6px 0 0;color:#6b7280">Potwierdzenie rezerwacji</p>
    </div>

    <div style="margin:16px 24px;background:#dcfce7;border:1px solid #16a34a;border-radius:8px;padding:14px">
      <b style="color:#15803d">✅ Dziękujemy! Twoja rezerwacja została przyjęta.</b><br>
      <span style="color:#15803d">Numer rezerwacji: <b>#${b.id.substring(0,8)}</b></span>
    </div>

    <div style="padding:0 24px 8px">
      <h3 style="color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px">Szczegóły usługi</h3>
      <table style="width:100%;border-collapse:collapse;color:#374151">
        <tr><td style="padding:6px 0;color:#6b7280;width:38%"><b>Usługa:</b></td><td style="padding:6px 0">${b.service}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><b>Metraż:</b></td><td style="padding:6px 0">${b.area}</td></tr>
        ${b.windowOption && b.windowOption !== 'none' ? `
        <tr><td style="padding:6px 0;color:#6b7280"><b>Mycie okien:</b></td>
            <td style="padding:6px 0">${b.windowOption === 'standard' ? 'Standardowe okna' :
                                        b.windowOption === 'nonStandard' ? 'Niestandardowe okna' : 'Inne'}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#6b7280"><b>Data i godzina:</b></td><td style="padding:6px 0">${b.date}, ${b.time}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><b>Czas trwania:</b></td><td style="padding:6px 0">${b.duration}</td></tr>
        <tr><td style="padding:12px 0 6px;color:#374151;font-size:16px"><b>Cena całkowita:</b></td>
            <td style="padding:12px 0 6px;color:#16a34a;font-weight:700;font-size:18px">${b.price} zł</td></tr>
      </table>
    </div>

    ${b.additionalInfo ? `
    <div style="margin:8px 24px 0;background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px;color:#92400e">
      <b>Dodatkowe informacje</b><br>
      <div style="margin-top:4px;white-space:pre-line">${b.additionalInfo}</div>
    </div>` : ''}

    <div style="padding:16px 24px 0">
      <h3 style="color:#1d4ed8">Co dalej?</h3>
      <ul style="margin:6px 0 0 18px;color:#1e40af">
        <li>Skontaktujemy się dzień przed wizytą, aby potwierdzić szczegóły.</li>
        <li>Nasz zespół przyjedzie punktualnie w wyznaczonym terminie.</li>
        <li>Płatność po wykonaniu usługi (gotówka lub przelew).</li>
      </ul>
    </div>

    <div style="border-top:1px solid #e5e7eb;margin-top:16px;padding:16px 24px;text-align:center;color:#6b7280">
      <div>📞 <b>+48 123 456 789</b></div>
      <div>📧 <a href="mailto:kontakt@sprzataniemieszkan.pl" style="color:#2563eb;text-decoration:none">kontakt@sprzataniemieszkan.pl</a></div>
      <div style="margin-top:8px;font-size:12px;color:#9ca3af">SprzątanieMieszkań.com — Profesjonalne sprzątanie mieszkań w Warszawie</div>
    </div>
  </div>`;
}

function adminHtml(b: Booking) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">
    <div style="padding:20px;text-align:center">
      <h2 style="margin:0;color:#dc2626">🆕 NOWA REZERWACJA</h2>
      <div style="color:#6b7280;margin-top:6px">#${b.id.substring(0,8)} • ${b.createdAt ? new Date(b.createdAt).toLocaleString('pl-PL') : ''}</div>
    </div>

    <div style="padding:0 20px 10px">
      <h3 style="color:#374151;border-bottom:2px solid #f3f4f6;padding-bottom:8px">👤 Dane klienta</h3>
      <table style="width:100%;border-collapse:collapse;color:#374151">
        <tr><td style="padding:6px 0;color:#6b7280;width:32%"><b>Imię i nazwisko:</b></td><td style="padding:6px 0">${b.firstName} ${b.lastName}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><b>Telefon:</b></td><td style="padding:6px 0"><a href="tel:${b.phone}" style="color:#2563eb;text-decoration:none">${b.phone}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><b>E-mail:</b></td><td style="padding:6px 0"><a href="mailto:${b.email}" style="color:#2563eb;text-decoration:none">${b.email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b7280"><b>Adres:</b></td><td style="padding:6px 0">${b.address}</td></tr>
      </table>
    </div>

    <div style="padding:0 20px 10px">
      <h3 style="color:#16a34a;border-bottom:2px solid #bbf7d0;padding-bottom:8px">🏠 Szczegóły usługi</h3>
      <table style="width:100%;border-collapse:collapse;color:#374151">
        <tr><td style="padding:6px 0;color:#166534;width:32%"><b>Usługa:</b></td><td style="padding:6px 0">${b.service}</td></tr>
        <tr><td style="padding:6px 0;color:#166534"><b>Metraż:</b></td><td style="padding:6px 0">${b.area}</td></tr>
        ${b.windowOption && b.windowOption !== 'none' ? `
        <tr><td style="padding:6px 0;color:#166534"><b>Mycie okien:</b></td><td style="padding:6px 0">${b.windowOption === 'standard' ? 'Standardowe' :
                                                                                               b.windowOption === 'nonStandard' ? 'Niestandardowe' : 'Inne'}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#166534"><b>Data:</b></td><td style="padding:6px 0">${b.date}</td></tr>
        <tr><td style="padding:6px 0;color:#166534"><b>Godzina:</b></td><td style="padding:6px 0">${b.time}</td></tr>
        <tr><td style="padding:6px 0;color:#166534"><b>Czas trwania:</b></td><td style="padding:6px 0">${b.duration}</td></tr>
        <tr><td style="padding:12px 0 6px;color:#16a34a;font-size:16px"><b>Cena:</b></td><td style="padding:12px 0 6px;color:#16a34a;font-weight:700;font-size:18px">${b.price} zł</td></tr>
      </table>
    </div>

    ${b.additionalInfo ? `
    <div style="margin:8px 20px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px;color:#92400e">
      <b>Notatka klienta</b><br>
      <div style="margin-top:4px;white-space:pre-line">${b.additionalInfo}</div>
    </div>` : ''}

    <div style="padding:16px 20px;text-align:center">
      <a href="tel:${b.phone}" style="display:inline-block;background:#16a34a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;margin-right:8px">📞 Zadzwoń</a>
      <a href="mailto:${b.email}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">📧 Napisz</a>
    </div>
  </div>`;
}
