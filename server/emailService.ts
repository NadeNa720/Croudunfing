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

Numer rezerwacji: ${booking.id}
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

// подтверждение клиенту
export async function sendCustomerConfirmation(booking: Booking): Promise<void> {
  const subject = `Potwierdzenie rezerwacji #${booking.id.substring(0, 8)} - SprzątanieMieszkań.com`;
  const html = `...ТВОЙ ТЕКУЩИЙ HTML ИЗ ПИСЬМА КЛИЕНТУ...`.replace('...', ''); // оставь твой шаблон
  const text = formatBookingForEmail(booking);
  await retryEmailSend(() => sendMail(booking.email, subject, html, text));
}

// уведомление владельцу
export async function sendBusinessNotification(booking: Booking): Promise<void> {
  const to = process.env.BUSINESS_EMAIL || 'admin@example.com';
  const subject = `🆕 Nowa rezerwacja #${booking.id.substring(0, 8)} - ${booking.firstName} ${booking.lastName}`;
  const html = `...ТВОЙ ТЕКУЩИЙ HTML ИЗ ПИСЬМА АДМИНУ...`.replace('...', '');
  const text = formatBookingForEmail(booking);
  await retryEmailSend(() => sendMail(to, subject, html, text));
}

// «проверка соединения» для SendGrid
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
