const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  return transporter;
}

const FROM_ADDRESS = process.env.SMTP_FROM || "noreply@atin.io";
const APP_NAME = "ATIN - AI Technology Intelligence Network";

function buildLayout(title, bodyContent) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { color: #94a3b8; margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px 24px; color: #334155; line-height: 1.6; }
    .content h2 { color: #1a1a2e; font-size: 20px; margin-top: 0; }
    .content p { font-size: 15px; margin: 0 0 16px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; margin: 8px 0; }
    .btn-secondary { background: linear-gradient(135deg, #64748b, #475569); }
    .code { background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 16px; letter-spacing: 2px; text-align: center; color: #1e293b; margin: 16px 0; }
    .info-box { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 16px 0; border-radius: 0 6px 6px 0; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px; }
    .footer a { color: #64748b; text-decoration: none; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${APP_NAME}</h1>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
      <p>You received this email because you have an account at ATIN.</p>
    </div>
  </div>
</body>
</html>`;
}

async function sendEmail(to, subject, html) {
  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: `"${APP_NAME}" <${FROM_ADDRESS}>`,
      to,
      subject,
      html,
    });

    logger.info("Email sent", { to, subject, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error("Email send error", { to, subject, error: error.message });
    return { success: false, error: error.message };
  }
}

async function sendWelcomeEmail(user) {
  const bodyContent = `
    <h2>Welcome to ${APP_NAME}!</h2>
    <p>Hi ${user.username},</p>
    <p>Your account has been created successfully. You now have access to real-time AI technology intelligence, trend analysis, and sentiment insights.</p>
    <div class="info-box">
      <strong>Account Details</strong><br>
      Username: ${user.username}<br>
      Email: ${user.email}
    </div>
    <p>Get started by exploring the dashboard and setting up your notification preferences.</p>
    <p style="text-align: center; margin-top: 24px;">
      <a href="${process.env.CORS_ORIGIN || 'http://localhost:5173'}/dashboard" class="btn">Go to Dashboard</a>
    </p>
    <hr class="divider">
    <p style="font-size: 13px; color: #64748b;">If you have any questions, reply to this email or visit our help center.</p>
  `;

  return sendEmail(user.email, `Welcome to ${APP_NAME}`, buildLayout("Welcome", bodyContent));
}

async function sendPasswordReset(user, token) {
  const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${token}`;

  const bodyContent = `
    <h2>Password Reset Request</h2>
    <p>Hi ${user.username},</p>
    <p>We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.</p>
    <p style="text-align: center; margin-top: 24px;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </p>
    <div class="info-box">
      <strong>Didn't request this?</strong><br>
      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
    </div>
    <p style="font-size: 13px; color: #94a3b8; word-break: break-all;">Reset URL: ${resetUrl}</p>
  `;

  return sendEmail(user.email, "Reset Your Password - ATIN", buildLayout("Password Reset", bodyContent));
}

async function sendNotification(user, notification) {
  const bodyContent = `
    <h2>${notification.title}</h2>
    <p>Hi ${user.username},</p>
    <p>${notification.message}</p>
    ${notification.data && notification.data.url ? `
    <p style="text-align: center; margin-top: 24px;">
      <a href="${notification.data.url}" class="btn">View Details</a>
    </p>
    ` : ""}
    <div class="info-box">
      <strong>Notification Type:</strong> ${notification.type}<br>
      <strong>Priority:</strong> ${notification.priority || "medium"}
    </div>
  `;

  return sendEmail(user.email, notification.title, buildLayout(notification.title, bodyContent));
}