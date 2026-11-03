import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Transporter factory
function getTransporter() {
    const senderEmail = process.env.SENDER_EMAIL;
    // Remove any accidental spaces in the 16-character app password
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, "") : "";

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: senderEmail,
            pass: emailPass,
        },
    });
}

// Health check endpoint
app.get("/", (req, res) => {
    return res.json({
        status: "online",
        message: "MathLens Mailer Service is running...",
        senderEmail: process.env.SENDER_EMAIL || "Not configured",
        isAppPasswordSet: Boolean(process.env.EMAIL_PASS && process.env.EMAIL_PASS.trim().length > 0),
    });
});

// Verification endpoint to test SMTP connection & App Password
app.get("/verify", async (req, res) => {
    if (!process.env.EMAIL_PASS) {
        return res.status(400).json({
            success: false,
            message: "EMAIL_PASS is not set in .env. Please generate a Google App Password and add it to .env.",
        });
    }

    try {
        const transporter = getTransporter();
        await transporter.verify();
        return res.json({
            success: true,
            message: "SMTP transporter successfully verified with Gmail!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to verify SMTP credentials.",
            error: error.message,
        });
    }
});

// Send Mail endpoint
app.post("/sendMail", async (req, res) => {
    const { to, email, name, subject, massage, message, text, query, html } = req.body;
    const content = message || massage || query || text;
    console.log(content);
    if (!content) {
        return res.status(400).json({
            success: false,
            message: "Message content is required (use 'message' or 'text').",
        });
    }

    if (!process.env.EMAIL_PASS) {
        return res.status(500).json({
            success: false,
            message: "EMAIL_PASS is missing in .env. An App Password is required when 2-Step Verification is enabled.",
        });
    }

    // Recipient resolution:
    // 1. Explicit 'to' field
    // 2. If 'to' is not provided, use 'email' as the recipient
    // 3. Fallback to SENDER_EMAIL
    const recipient = to || email || process.env.SENDER_EMAIL;
    const replyToAddress = email && email !== recipient ? email : undefined;
    const mailSubject = subject || (name ? `New Contact Inquiry from ${name}` : "New Contact Inquiry - MathLens");

    console.log(`\n--- [Mailer] Processing /sendMail request ---`);
    console.log(`  Payload received:`, req.body);
    console.log(`  From (Sender):    ${process.env.SENDER_EMAIL}`);
    console.log(`  To (Recipient):   ${recipient}`);
    console.log(`  Subject:          ${mailSubject}`);

    const mailOptions = {
        from: `"MathLens" <${process.env.SENDER_EMAIL}>`,
        to: recipient,
        replyTo: replyToAddress,
        subject: mailSubject,
        text: `From: ${name || "Anonymous"} (${email || "No email provided"})\n\n${content}`,
        html:
            html ||
            `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2563eb; color: #ffffff; padding: 18px 24px;">
          <h2 style="margin: 0; font-size: 20px;">MathLens Message</h2>
        </div>
        <div style="padding: 24px;">
          ${name ? `<p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>` : ""}
          ${email ? `<p style="margin: 0 0 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>` : ""}
          ${mailSubject ? `<p style="margin: 0 0 16px 0;"><strong>Subject:</strong> ${mailSubject}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #2563eb;">
            <p style="white-space: pre-wrap; margin: 0; font-size: 14px; color: #334155;">${content}</p>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; text-align: center;">
          Sent automatically via MathLens Mailer Service
        </div>
      </div>
      `,
    };

    try {
        const transporter = getTransporter();
        const info = await transporter.sendMail(mailOptions);
        console.log(`  [Success] Gmail accepted email for: ${JSON.stringify(info.accepted)}`);
        console.log(`  [Success] Message ID: ${info.messageId}\n`);
        return res.status(200).json({
            success: true,
            message: "Email sent successfully!",
            recipient: recipient,
            messageId: info.messageId,
        });
    } catch (error) {
        console.error("  [Error] Failed sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send email.",
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`MathLens Mailer Service is running on http://localhost:${PORT}`);
});
