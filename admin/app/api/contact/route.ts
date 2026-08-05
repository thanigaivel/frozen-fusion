import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const contactsCollection = db.collection("contacts");

    const contactEntry = {
      name,
      email,
      message,
      submittedAt: new Date(),
    };

    const result = await contactsCollection.insertOne(contactEntry);

    return NextResponse.json(
      { success: true, message: "Message sent successfully.", id: result.insertedId },
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
