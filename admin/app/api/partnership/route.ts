import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";
import { getPartnerships } from "@/lib/partnership-db";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET() {
  const inquiries = await getPartnerships();
  return NextResponse.json({ success: true, inquiries }, { 
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, address, description, selectedType } = body;

    if (!name || !contact || !address || !description || !selectedType) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Save to Database
    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const partnershipsCollection = db.collection("partnerships");

    await partnershipsCollection.insertOne({
      name,
      contact,
      address,
      description,
      selectedType,
      createdAt: new Date(),
    });

    // Configure the SMTP transporter for Titan Mail (GoDaddy)
    // For this to work, the user needs to set SMTP_USER and SMTP_PASS in .env.local
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.titan.email",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_PORT === "587" ? false : true, // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Frozen Fusion Partnership" <${process.env.SMTP_USER || "noreply@frozenfusion.in"}>`,
      to: "support@frozenfusion.in", // The destination email requested by the user
      subject: `New Partnership Inquiry: ${selectedType} - ${name}`,
      text: `
New Partnership Inquiry Details:

Type: ${selectedType}
Name: ${name}
Contact Number: ${contact}
Address: ${address}

Description / Additional Details:
${description}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #e12d6a;">New Partnership Inquiry</h2>
          <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Partnership Type</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${selectedType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Number</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${contact}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${address}</td>
            </tr>
          </table>
          <h3 style="margin-top: 20px; color: #555;">Description & Details:</h3>
          <p style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #e12d6a; white-space: pre-wrap;">${description}</p>
        </div>
      `,
    };

    // Attempt to send email, but gracefully handle missing credentials during dev
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP credentials not configured. Email would have been sent to support@frozenfusion.in");
      
      // We still return success to the frontend for development purposes
      return NextResponse.json(
        { success: true, message: "Inquiry received and saved to DB (Email mocked due to missing SMTP credentials)." },
        { 
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" } 
        }
      );
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Inquiry saved to DB and sent successfully to support@frozenfusion.in." },
      { 
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" } 
      }
    );
  } catch (error) {
    console.error("[PARTNERSHIP POST ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" } 
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
