import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const maxDuration = 60; // Optional: increased timeout just in case
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, fileBase64, fileName, fileType } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: "Name, email, and role are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const careersCollection = db.collection("careers");

    const application = {
      name,
      email,
      role,
      fileBase64, // Stored as base64 string
      fileName,
      fileType,
      appliedAt: new Date(),
    };

    const result = await careersCollection.insertOne(application);

    return NextResponse.json(
      { success: true, message: "Application submitted successfully.", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CAREERS API ERROR]", error);
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
