const nodemailer = require("nodemailer");

let transporter;

const localeNames = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  he: "עברית",
  fr: "Français",
  ar: "العربية",
  it: "Italiano",
  es: "Español",
  zh: "中文",
};

function escapeHtml(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return String(value).replace(/[&<>"']/g, (character) => characters[character]);
}

function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function formatSubmittedAt(date = new Date()) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function createContactRequestEmail(contactRequest) {
  const fullName = contactRequest.fullName || "İsimsiz kullanıcı";
  const email = contactRequest.email || "Belirtilmedi";
  const message = contactRequest.message || "Mesaj belirtilmedi.";
  const locale = localeNames[contactRequest.locale] || contactRequest.locale || "Türkçe";
  const submittedAt = formatSubmittedAt();
  const phoneHref = String(contactRequest.phone).replace(/[^\d+]/g, "");
  const safeFullName = escapeHtml(fullName);
  const safePhone = escapeHtml(contactRequest.phone);
  const safeEmail = escapeHtml(email);
  const safeLocale = escapeHtml(locale);
  const safeSubmittedAt = escapeHtml(submittedAt);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

  const text = [
    "Yeni randevu talebi",
    "",
    `${fullName} web sitesindeki iletişim formunu gönderdi.`,
    "",
    `Ad soyad: ${fullName}`,
    `Telefon: ${contactRequest.phone}`,
    `E-posta: ${email}`,
    `Dil: ${locale}`,
    `Gönderim: ${submittedAt}`,
    `Talep no: #${contactRequest.id}`,
    "",
    "Mesaj",
    message,
  ].join("\n");

  const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Yeni randevu talebi</title>
  </head>
  <body style="margin:0;background:#ffffff;color:#172038;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safeFullName} tarafından yeni randevu talebi gönderildi.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:560px;border-collapse:collapse;">
            <tr>
              <td style="border-top:2px solid #516fc9;padding:24px 0 20px;">
                <p style="margin:0 0 12px;color:#516fc9;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Akif Poliklinik</p>
                <h1 style="margin:0;color:#172038;font-size:24px;font-weight:500;line-height:1.25;">Yeni randevu talebi</h1>
                <p style="margin:8px 0 0;color:#667085;font-size:14px;line-height:1.6;">${safeFullName}, web sitesindeki iletişim formunu gönderdi.</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e6e8ee;border-bottom:1px solid #e6e8ee;padding:12px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td width="112" valign="top" style="padding:8px 12px 8px 0;color:#7a8190;font-size:12px;line-height:1.5;">Ad soyad</td>
                    <td valign="top" style="padding:8px 0;color:#172038;font-size:14px;line-height:1.5;">${safeFullName}</td>
                  </tr>
                  <tr>
                    <td width="112" valign="top" style="padding:8px 12px 8px 0;color:#7a8190;font-size:12px;line-height:1.5;">Telefon</td>
                    <td valign="top" style="padding:8px 0;color:#172038;font-size:14px;line-height:1.5;"><a href="tel:${escapeHtml(phoneHref)}" style="color:#172038;text-decoration:none;">${safePhone}</a></td>
                  </tr>
                  <tr>
                    <td width="112" valign="top" style="padding:8px 12px 8px 0;color:#7a8190;font-size:12px;line-height:1.5;">E-posta</td>
                    <td valign="top" style="padding:8px 0;color:#172038;font-size:14px;line-height:1.5;">${contactRequest.email ? `<a href="mailto:${safeEmail}" style="color:#172038;text-decoration:none;">${safeEmail}</a>` : safeEmail}</td>
                  </tr>
                  <tr>
                    <td width="112" valign="top" style="padding:8px 12px 8px 0;color:#7a8190;font-size:12px;line-height:1.5;">Dil</td>
                    <td valign="top" style="padding:8px 0;color:#172038;font-size:14px;line-height:1.5;">${safeLocale}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 28px;">
                <p style="margin:0 0 10px;color:#7a8190;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Mesaj</p>
                <p dir="auto" style="margin:0;color:#172038;font-size:15px;line-height:1.65;">${safeMessage}</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e6e8ee;padding:16px 0 0;color:#9298a5;font-size:11px;line-height:1.6;">
                Talep #${escapeHtml(contactRequest.id)} · ${safeSubmittedAt}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: `Randevu talebi · ${sanitizeHeaderValue(fullName)}`,
    text,
    html,
  };
}

function isMailEnabled() {
  return process.env.MAIL_ENABLED === "true";
}

function getTransporter() {
  if (!transporter) {
    const authentication = process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      : undefined;

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: authentication,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }

  return transporter;
}

async function sendContactRequestNotification(contactRequest) {
  if (!isMailEnabled()) {
    return false;
  }

  const recipient = process.env.CONTACT_NOTIFICATION_TO;
  const fromAddress = process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER;

  if (!process.env.SMTP_HOST || !recipient || !fromAddress) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const email = createContactRequestEmail(contactRequest);

  await getTransporter().sendMail({
    from: {
      name: process.env.SMTP_FROM_NAME || "Akif Poliklinik",
      address: fromAddress,
    },
    to: recipient,
    replyTo: contactRequest.email || undefined,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return true;
}

module.exports = { sendContactRequestNotification };
