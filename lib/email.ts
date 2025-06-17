// lib/email.ts
import * as brevo from "@getbrevo/brevo";

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

const FROM_EMAIL = process.env.EMAIL_FROM || "admin@noisemap.xyz";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Noise Map";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: FROM_NAME,
    email: FROM_EMAIL,
  };

  sendSmtpEmail.to = [
    {
      email: email,
    },
  ];

  sendSmtpEmail.subject = "Reset your password - Noise Map";

  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
          <h1 style="color: #1a73e8; margin: 0 0 20px 0; font-size: 28px;">Reset Your Password</h1>
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi there,</p>
          <p style="margin: 0 0 20px 0; font-size: 16px;">You requested to reset your password for your Noise Map account. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #1a73e8; color: white; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #1a73e8; word-break: break-all;">${resetUrl}</p>
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">This link will expire in 1 hour for security reasons.</p>
          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0 0 5px 0;">© 2024 Noise Map. All rights reserved.</p>
          <p style="margin: 0 0 5px 0;">Find your quiet in the city</p>
          <p style="margin: 0;"><a href="https://www.noisemap.xyz" style="color: #1a73e8; text-decoration: none;">www.noisemap.xyz</a></p>
        </div>
      </body>
    </html>
  `;

  sendSmtpEmail.textContent = `
Reset Your Password

You requested to reset your password for your Noise Map account.

Click this link to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

---
Noise Map - Find your quiet in the city
www.noisemap.xyz
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Password reset email sent:", data.body);
    console.log("Full API response:", JSON.stringify(data, null, 2));
    console.log("Message ID:", data.body?.messageId);
    console.log("Response status:", data.response?.statusCode);
    return {
      success: true,
      messageId: (data.body as { messageId?: string }).messageId || "sent",
    };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.sender = {
    name: FROM_NAME,
    email: FROM_EMAIL,
  };

  sendSmtpEmail.to = [
    {
      email: email,
      name: name,
    },
  ];

  sendSmtpEmail.subject = "Welcome to Noise Map! 🎉";

  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Noise Map</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
          <h1 style="color: #1a73e8; margin: 0 0 20px 0; font-size: 28px;">Welcome to Noise Map${
            name ? `, ${name}` : ""
          }! 🎉</h1>
          <p style="margin: 0 0 20px 0; font-size: 16px;">Thank you for joining our community of urban explorers seeking quieter paths through the city.</p>
          
          <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Get Started with Noise Map:</h2>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">📍 <strong>Report noise levels</strong> in your area using your device's microphone</li>
              <li style="margin-bottom: 10px;">🗺️ <strong>Discover quiet routes</strong> for peaceful walks through the city</li>
              <li style="margin-bottom: 10px;">🌆 <strong>Contribute to a quieter city</strong> by sharing real-time noise data</li>
              <li style="margin-bottom: 10px;">📊 <strong>View heat maps</strong> to understand noise patterns in your neighborhood</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.NEXTAUTH_URL
            }" style="display: inline-block; background-color: #1a73e8; color: white; padding: 14px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">Start Exploring</a>
          </div>
          
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Need help getting started? Check out our <a href="${
            process.env.NEXTAUTH_URL
          }/help" style="color: #1a73e8; text-decoration: none;">Help Center</a> or reply to this email.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0 0 5px 0;">© 2024 Noise Map. All rights reserved.</p>
          <p style="margin: 0 0 5px 0;">Find your quiet in the city</p>
          <p style="margin: 0;"><a href="https://www.noisemap.xyz" style="color: #1a73e8; text-decoration: none;">www.noisemap.xyz</a></p>
        </div>
      </body>
    </html>
  `;

  sendSmtpEmail.textContent = `
Welcome to Noise Map${name ? `, ${name}` : ""}!

Thank you for joining our community of urban explorers seeking quieter paths through the city.

Get Started with Noise Map:
• Report noise levels in your area using your device's microphone
• Discover quiet routes for peaceful walks through the city
• Contribute to a quieter city by sharing real-time noise data
• View heat maps to understand noise patterns in your neighborhood

Start exploring: ${process.env.NEXTAUTH_URL}

Need help? Visit our Help Center at ${
    process.env.NEXTAUTH_URL
  }/help or reply to this email.

---
Noise Map - Find your quiet in the city
www.noisemap.xyz
  `;

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Welcome email sent:", data.body);
    return {
      success: true,
      messageId: (data.body as { messageId?: string }).messageId || "sent",
    };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error };
  }
}
