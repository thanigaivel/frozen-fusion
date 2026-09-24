import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("[CONTACT API] SMTP credentials not configured. Skipping email dispatch.");
      return { success: false, error: "SMTP credentials not configured" };
    }

    // Dynamic import prevents module-level bundling/import errors on some environments
    const nodemailer = (await import("nodemailer")).default;

    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await transporter.sendMail({
      from: `"Frozen Fusion Contact" <${process.env.SMTP_USER}>`,
      to: "support@frozenfusion.in",
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact Form] ${subject} - ${name}`,
      text: `New Contact Form Submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nDate: ${formattedDate}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #232733;">
          <div style="background: linear-gradient(135deg, #1f1b2e 0%, #11131a 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #FF6BD6;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">
              Frozen <span style="color: #FF6BD6;">Fusion</span>
            </h1>
            <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af; letter-spacing: 0.5px;">
              New Website Contact Inquiry
            </p>
          </div>

          <div style="padding: 28px 24px;">
            <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; width: 100px; vertical-align: top;">Name</td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Email</td>
                  <td style="padding: 8px 0; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #60A5FA; text-decoration: none; font-weight: 500;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Subject</td>
                  <td style="padding: 8px 0; color: #FF6BD6; font-size: 14px; font-weight: 600;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Received</td>
                  <td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">${formattedDate}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 24px;">
              <h3 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Message</h3>
              <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #FF6BD6; border-radius: 4px; padding: 16px; color: #e5e7eb; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)} - Frozen Fusion" style="display: inline-block; background: #FF6BD6; color: #ffffff; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 13px;">
                Reply to ${name}
              </a>
              <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">
                You can also hit "Reply" in your email client to respond directly to ${email}.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log(`[CONTACT API] Email sent to support@frozenfusion.in for ${name} (${email})`);
    return { success: true };
  } catch (emailErr: any) {
    // Email errors MUST NEVER crash the API — always log and continue
    console.error("[CONTACT API EMAIL ERROR]", emailErr);
    return { success: false, error: emailErr.message || String(emailErr) };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1. Save to MongoDB
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const contactsCollection = db.collection("contacts");

    const result = await contactsCollection.insertOne({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      submittedAt: new Date(),
    });

    // 2. Send email (await it so serverless function doesn't kill the process early)
    const emailResult = await sendContactEmail(name, email, subject || "General Inquiry", message);

    return NextResponse.json(
      { success: true, message: "Message sent successfully.", id: result.insertedId, emailStatus: emailResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CONTACT API ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
