const nodemailer = require("nodemailer");
const { URL } = require("node:url");

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
    `KVKK aydınlatma sürümü: ${contactRequest.privacyNoticeVersion}`,
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
                  <tr>
                    <td width="112" valign="top" style="padding:8px 12px 8px 0;color:#7a8190;font-size:12px;line-height:1.5;">KVKK bilgisi</td>
                    <td valign="top" style="padding:8px 0;color:#172038;font-size:14px;line-height:1.5;">Aydınlatma metni ${escapeHtml(contactRequest.privacyNoticeVersion)} okundu</td>
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

function createPasswordResetEmail({ fullName, resetUrl, expiresAt }) {
  const safeFullName = escapeHtml(fullName || "Yönetici");
  const safeResetUrl = escapeHtml(resetUrl);
  const safeExpiresAt = escapeHtml(formatSubmittedAt(expiresAt));
  const text = [
    "Akif Poliklinik admin parola sıfırlama",
    "",
    `Merhaba ${fullName || "Yönetici"},`,
    "",
    "Admin hesabınız için parola sıfırlama isteği aldık.",
    `Bağlantı: ${resetUrl}`,
    `Geçerlilik: ${formatSubmittedAt(expiresAt)}`,
    "",
    "Bu isteği siz yapmadıysanız e-postayı yok sayabilirsiniz.",
  ].join("\n");
  const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Parolanızı sıfırlayın</title>
  </head>
  <body style="margin:0;background:#ffffff;color:#172038;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Akif Poliklinik admin hesabınız için parola sıfırlama bağlantısı.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#ffffff;border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:520px;border-collapse:collapse;">
            <tr>
              <td style="border-top:2px solid #516fc9;padding:24px 0 20px;">
                <p style="margin:0 0 12px;color:#516fc9;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;">Akif Poliklinik</p>
                <h1 style="margin:0;color:#172038;font-size:24px;font-weight:500;line-height:1.25;">Parolanızı sıfırlayın</h1>
                <p style="margin:10px 0 0;color:#667085;font-size:14px;line-height:1.65;">Merhaba ${safeFullName}, admin hesabınız için parola sıfırlama isteği aldık.</p>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #e6e8ee;border-bottom:1px solid #e6e8ee;padding:24px 0;">
                <a href="${safeResetUrl}" style="display:inline-block;background:#516fc9;color:#ffffff;font-size:14px;font-weight:600;line-height:1;text-decoration:none;padding:14px 20px;">Yeni parola belirle</a>
                <p style="margin:16px 0 0;color:#7a8190;font-size:12px;line-height:1.6;">Bağlantı ${safeExpiresAt} tarihine kadar geçerlidir ve yalnızca bir kez kullanılabilir.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 0 0;color:#9298a5;font-size:11px;line-height:1.6;">
                Bu isteği siz yapmadıysanız e-postayı yok sayabilirsiniz. Parolanız değişmez.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: "Akif Poliklinik · Parola sıfırlama",
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

async function sendPasswordResetNotification({ email, fullName, token, expiresAt }) {
  if (!isMailEnabled()) {
    return false;
  }

  const recipient = process.env.PASSWORD_RESET_TO || email;
  const fromAddress = process.env.SMTP_FROM_ADDRESS || process.env.SMTP_USER;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!process.env.SMTP_HOST || !recipient || !fromAddress) {
    throw new Error("SMTP password reset configuration is incomplete.");
  }

  const resetUrl = new URL("/admin/reset-password", frontendUrl);
  resetUrl.searchParams.set("token", token);
  const emailContent = createPasswordResetEmail({
    fullName,
    resetUrl: resetUrl.toString(),
    expiresAt,
  });

  await getTransporter().sendMail({
    from: {
      name: process.env.SMTP_FROM_NAME || "Akif Poliklinik",
      address: fromAddress,
    },
    to: recipient,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  return true;
}

module.exports = {
  sendContactRequestNotification,
  sendPasswordResetNotification,
};
