import { NextResponse } from "next/server";
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

async function sendPartnershipEmail(
  name: string,
  contact: string,
  address: string,
  description: string,
  selectedType: string
) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("[PARTNERSHIP API] RESEND_API_KEY not configured. Skipping email dispatch.");
      return { success: false, error: "RESEND_API_KEY not configured" };
    }

    const formattedDate = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0c10; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #232733;">
        <div style="background: linear-gradient(135deg, #1f1b2e 0%, #11131a 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #FF6BD6;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">
            Frozen <span style="color: #FF6BD6;">Fusion</span>
          </h1>
          <p style="margin: 8px 0 0; font-size: 13px; color: #9ca3af; letter-spacing: 0.5px;">
            New Partnership Inquiry
          </p>
        </div>

        <div style="padding: 28px 24px;">
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; width: 130px; vertical-align: top;">Partnership Type</td>
                <td style="padding: 8px 0; color: #FF6BD6; font-size: 14px; font-weight: 600;">${selectedType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Contact Number</td>
                <td style="padding: 8px 0; font-size: 14px; color: #60A5FA; font-weight: 500;">${contact}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Address</td>
                <td style="padding: 8px 0; color: #e5e7eb; font-size: 14px;">${address}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px; vertical-align: top;">Received</td>
                <td style="padding: 8px 0; color: #9ca3af; font-size: 13px;">${formattedDate}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">Description & Details</h3>
            <div style="background: rgba(255, 255, 255, 0.03); border-left: 3px solid #FF6BD6; border-radius: 4px; padding: 16px; color: #e5e7eb; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${description}</div>
          </div>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Frozen Fusion Partnership <contact@frozenfusion.in>", // Using the verified domain
        to: "support@frozenfusion.in",
        subject: `[Partnership] ${selectedType} - ${name}`,
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[PARTNERSHIP API EMAIL ERROR] Resend failed:", data);
      return { success: false, error: data };
    }

    console.log(`[PARTNERSHIP API] Email sent to support@frozenfusion.in for ${name} via Resend. ID: ${data.id}`);
    return { success: true, data };
  } catch (emailErr: any) {
    console.error("[PARTNERSHIP API EMAIL ERROR]", emailErr);
    return { success: false, error: emailErr.message || String(emailErr) };
  }
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

    // Send email via Resend API
    const emailResult = await sendPartnershipEmail(name, contact, address, description, selectedType);

    return NextResponse.json(
      { 
        success: true, 
        message: "Inquiry saved to DB and sent successfully.",
        emailStatus: emailResult
      },
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
