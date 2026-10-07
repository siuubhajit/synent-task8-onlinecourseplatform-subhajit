const nodemailer = require('nodemailer');

/**
 * Handles sending transactional emails (verification, reset password, enrollment receipt).
 * In development, if SMTP is not configured, logs formatted email boxes directly to the terminal.
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.sender = process.env.EMAIL_FROM || 'LearnPulse <no-reply@learnpulse.internal>';

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        console.log('[EmailService] SMTP transporter initialized.');
      } catch (err) {
        console.warn('[EmailService] Failed to initialize SMTP transporter:', err.message);
      }
    }
  }

  async sendMail({ to, subject, html, text }) {
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: this.sender,
          to,
          subject,
          text,
          html
        });
        console.log(`[EmailService] Sent email to ${to} (MessageID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error('[EmailService Error]', error.message);
      }
    }

    // Dev mode fallback logger
    console.log('\n' + '='.repeat(60));
    console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('-'.repeat(60));
    console.log(text || html);
    console.log('='.repeat(60) + '\n');
    return { success: true, simulated: true };
  }

  async sendWelcomeVerification(user, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
    
    return this.sendMail({
      to: user.email,
      subject: 'Welcome to LearnPulse - Verify your email address',
      text: `Hi ${user.name},\n\nWelcome to LearnPulse! Please verify your email using this 6-digit code or link:\n\nCode: ${token}\nLink: ${verifyUrl}\n\nHappy learning!`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Welcome to LearnPulse!</h2>
          <p>Hi ${user.name}, thanks for joining our learning community. Please verify your email address to unlock your full student dashboard.</p>
          <div style="margin: 24px 0; padding: 16px; background: #f8fafc; text-align: center; border-radius: 6px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">Verification Code</p>
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${token}</span>
          </div>
          <p>Or click below to verify directly:</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Verify Email Address</a>
        </div>
      `
    });
  }

  async sendPasswordReset(user, token) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    return this.sendMail({
      to: user.email,
      subject: 'LearnPulse - Password Reset Request',
      text: `Hi ${user.name},\n\nYou requested a password reset. Use token: ${token} or click: ${resetUrl}\nThis link expires in 15 minutes.`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Reset Your Password</h2>
          <p>Hi ${user.name}, we received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
          <div style="margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">Token expires in 15 minutes.</p>
        </div>
      `
    });
  }

  async sendEnrollmentConfirmation(user, course, paymentDetails = {}) {
    return this.sendMail({
      to: user.email,
      subject: `Enrollment Confirmed: ${course.title}`,
      text: `Hi ${user.name},\n\nYou are now enrolled in "${course.title}".\nAmount: ₹${paymentDetails.amount || 0}\nTransaction ID: ${paymentDetails.paymentId || 'FREE_ENROLL'}\n\nYou can access your lessons anytime from your student dashboard.`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #16a34a;">Enrollment Successful! 🎉</h2>
          <p>Hi ${user.name}, congratulations on taking the next step in your learning journey.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f172a;">${course.title}</h3>
            <p style="margin: 4px 0; font-size: 14px; color: #475569;">Instructor: ${course.instructor || 'LearnPulse Faculty'}</p>
            <p style="margin: 4px 0; font-size: 14px; color: #475569;">Amount Paid: ₹${paymentDetails.amount || 0}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">Receipt: ${paymentDetails.paymentId || 'FREE_ENROLL'}</p>
          </div>
          <p>Head to your dashboard to start watching the first lesson.</p>
        </div>
      `
    });
  }
}

module.exports = new EmailService();
