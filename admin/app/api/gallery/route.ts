import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getGalleryImages, deleteGalleryImage } from "@/lib/gallery-db";
import fs from "fs/promises";
import path from "path";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET() {
  const images = await getGalleryImages();
  return NextResponse.json({ success: true, images }, { 
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageBase64 } = body;

    if (!title || !imageBase64) {
      return NextResponse.json(
        { error: "Title and image are required." },
        { status: 400 }
      );
    }

    const match = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,/);
    const ext = match ? match[1].replace("+", "") : "jpg";
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    const fileName = `gallery-${Date.now()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "../frozen-fusion/public/uploads");
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);
    const imageUrl = `/uploads/${fileName}`;

    const client = await clientPromise;
    const db = client.db("frozenfusion");
    const galleryCollection = db.collection("gallery");

    const imageEntry = {
      title,
      description: description || "",
      imageUrl,
      uploadedAt: new Date(),
    };

    const result = await galleryCollection.insertOne(imageEntry);

    return NextResponse.json(
      { success: true, message: "Image uploaded successfully.", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("[GALLERY POST ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID is required." }, { status: 400 });
    }

    const result = await deleteGalleryImage(id);
    if (!result.success || !result.imageUrl) {
      return NextResponse.json({ error: result.error || "Failed to delete from DB." }, { status: 400 });
    }

    // Attempt to delete the file
    try {
      const fileName = result.imageUrl.split("/").pop();
      if (fileName) {
        const filePath = path.join(process.cwd(), "../frozen-fusion/public/uploads", fileName);
        await fs.unlink(filePath);
      }
    } catch (fsError) {
      console.warn("Could not delete file from disk, but DB record was deleted.", fsError);
    }

    return NextResponse.json({ success: true, message: "Image deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("[GALLERY DELETE ERROR]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
