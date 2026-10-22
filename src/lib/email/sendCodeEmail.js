import nodemailer from "nodemailer";

// Sends the auth emails (6-digit codes and the account-created welcome) from
// the app instead of Supabase's mailer. SMTP_* comes from .env.local; without
// it (local dev) the email is summarised in the `npm run dev` terminal instead.

const CONTENT = {
    signup: {
        subject: (code) => `Your Ascendus verification code: ${code}`,
        title: "Verify your email",
        intro: (email) =>
            `Thanks for creating your careers account. Enter this code on the verification page to confirm <strong>${email}</strong>:`,
        outro: "This code expires in 1 hour. If you didn't create an account, you can ignore this email.",
    },
    recovery: {
        subject: (code) => `Your Ascendus password reset code: ${code}`,
        title: "Reset your password",
        intro: (email) =>
            `We received a request to reset the password for <strong>${email}</strong>. Enter this verification code to continue:`,
        outro: "This code expires in 1 hour. If you didn't ask to reset your password, ignore this email. Your password will stay the same.",
    },
};

const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// The shared card: brand, uppercase title, intro, a middle block (code box or
// button) and a muted closing line.
function renderHtml({ title, intro, middle, outro }) {
    return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#0e2b4b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;">
            <tr><td style="padding:32px 32px 0;font-size:20px;font-weight:bold;color:#0061af;">Ascendus Careers</td></tr>
            <tr><td style="padding:24px 32px 0;font-size:14px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">${title}</td></tr>
            <tr><td style="padding:16px 32px 0;font-size:14px;line-height:20px;">${intro}</td></tr>
            <tr><td align="center" style="padding:24px 32px;">${middle}</td></tr>
            <tr><td style="padding:0 32px 32px;font-size:13px;line-height:20px;color:#5c7088;">${outro}</td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#5c7088;">&copy; Ascendus Careers Portal</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

let transporter;
function getTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
    const port = Number(SMTP_PORT || 587);
    transporter ??= nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s/g, "") },
    });
    return transporter;
}

// Sends the mail, or prints `devLine` when SMTP_* isn't set.
async function send({ to, subject, text, html, devLine }) {
    const smtp = getTransporter();
    if (!smtp) {
        console.log(`\n[auth] ${devLine}  (SMTP_* not set, email not sent)\n`);
        return;
    }
    await smtp.sendMail({
        from: process.env.SMTP_FROM || `"Ascendus Careers" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
    });
}

// kind: "signup" | "recovery".
export async function sendCodeEmail(kind, email, code) {
    const content = CONTENT[kind];
    await send({
        to: email,
        subject: content.subject(code),
        text: `${content.title}\n\nYour code: ${code}\n\n${content.outro}`,
        html: renderHtml({
            title: content.title,
            intro: content.intro(escapeHtml(email)),
            middle: `<div style="display:inline-block;padding:16px 28px;border:1px solid #c9d0d8;border-radius:8px;background:#f8fafc;font-size:32px;font-weight:bold;letter-spacing:10px;color:#0e2b4b;">${code}</div>`,
            outro: content.outro,
        }),
        devLine: `${kind} code for ${email}: ${code}`,
    });
}

// Sent once, after the sign-up code is verified. `signInUrl` is optional;
// without it the email has no button.
export async function sendAccountCreatedEmail(email, firstName, signInUrl) {
    const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
    const outro = "If you didn't create this account, contact us so we can secure it.";
    const button = signInUrl
        ? `<a href="${escapeHtml(signInUrl)}" style="display:inline-block;padding:12px 28px;border-radius:8px;background:#0061af;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Sign In</a>`
        : "";
    await send({
        to: email,
        subject: "Your Ascendus Careers account is ready",
        text:
            `${firstName ? `Hi ${firstName},` : "Hi,"}\n\n` +
            `Your careers account for ${email} has been created and your email is verified. ` +
            `You can now sign in, build your profile and apply for jobs.` +
            `${signInUrl ? `\n\nSign in: ${signInUrl}` : ""}\n\n${outro}`,
        html: renderHtml({
            title: "Account created successfully",
            intro:
                `${greeting}<br><br>Your careers account for <strong>${escapeHtml(email)}</strong> has been created and your email is verified. ` +
                "You can now sign in, build your profile and apply for jobs.",
            middle: button,
            outro,
        }),
        devLine: `account-created email for ${email}${signInUrl ? ` (sign-in link ${signInUrl})` : ""}`,
    });
}
