import { NextResponse } from "next/server";
import { getEventBookings } from "@/lib/events-db";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await getEventBookings();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("[EVENTS GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contactNo, deliveryAddress, eventDescription, eventType } = body;

    if (!name || !contactNo || !deliveryAddress || !eventType) {
      return NextResponse.json(
        { error: "Name, contact number, delivery address, and event type are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const now = new Date();

    const newEvent = {
      name,
      contactNo,
      deliveryAddress,
      eventDescription: eventDescription || "",
      eventType,
      status: "Pending",
      appliedAt: now,
    };

    const result = await db.collection("events").insertOne(newEvent);
    const eventId = result.insertedId.toString();

    // Send Email via Nodemailer
    try {
      // Configuration should ideally come from environment variables.
      // E.g., process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASS
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER || '"Frozen Fusion" <noreply@frozenfusion.in>',
        to: "support@frozenfusion.in",
        subject: `New Event Booking: ${eventType} by ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6BD6;">New Event Booking Request</h2>
            <p><strong>Event Type:</strong> ${eventType}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact No:</strong> ${contactNo}</p>
            <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
            <p><strong>Description:</strong> ${eventDescription || "N/A"}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888; font-size: 12px;">This was sent from the Frozen Fusion automated system.</p>
          </div>
        `,
      };

      // Only attempt to send if SMTP_USER is configured, to prevent crashes on dev environments
      if (process.env.SMTP_USER) {
        await transporter.sendMail(mailOptions);
        console.log("Email sent to support@frozenfusion.in");
      } else {
        console.warn("SMTP_USER not configured. Skipping email notification.");
      }
    } catch (emailError) {
      console.error("[EMAIL ERROR]", emailError);
      // We don't fail the whole request if email fails, just log it.
    }

    return NextResponse.json({ success: true, id: eventId }, { status: 201 });
  } catch (error) {
    console.error("[EVENTS POST ERROR]", error);
    return NextResponse.json({ error: "Failed to submit event booking." }, { status: 500 });
  }
}
