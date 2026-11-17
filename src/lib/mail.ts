import nodemailer from "nodemailer";

export const ADMIN_EMAIL = process.env.NOTIFY_EMAIL || "trboalgo@gmail.com";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends an email if SMTP is configured; otherwise logs and returns false (never throws). */
export async function sendMail(to: string, subject: string, lines: string[]) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn(`[mail] SMTP not configured — skipped "${subject}" to ${to}`);
    return false;
  }
  try {
    const t = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
    await t.sendMail({
      from: SMTP_FROM || `BTI – Best Trading Indicator <${SMTP_USER}>`,
      to, subject,
      text: lines.join("\n"),
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#0b1220">${lines.map((l) => `<p>${esc(l)}</p>`).join("")}</div>`,
    });
    return true;
  } catch (e) {
    console.error("[mail] failed", e);
    return false;
  }
}
