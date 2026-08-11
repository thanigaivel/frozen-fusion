import { NextResponse } from "next/server";
import { getGalleryImages, createGalleryImages, deleteGalleryImage, slugify } from "@/lib/gallery-db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outletSlug = searchParams.get("outletSlug") || searchParams.get("outlet") || undefined;
    const images = await getGalleryImages(outletSlug);
    return NextResponse.json({ success: true, images }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("[GALLERY GET ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch gallery." }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let entriesToCreate: Array<{
      title: string;
      description?: string;
      outletName: string;
      outletSlug: string;
      imageUrl: string;
    }> = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const title = (formData.get("title") as string) || "Gallery Photo";
      const description = (formData.get("description") as string) || "";
      const rawOutletName = (formData.get("outletName") as string) || "Tuticorin Flagship Lounge";
      const outletName = rawOutletName.trim() || "Tuticorin Flagship Lounge";
      const outletSlug = slugify(outletName);

      // Get all files from 'images' or 'file' key
      const files = formData.getAll("images") as File[];
      const singleFile = formData.get("image") || formData.get("file");
      if (singleFile && singleFile instanceof File && !files.includes(singleFile)) {
        files.push(singleFile);
      }

      if (files.length === 0 || files.every((f) => !f || f.size === 0)) {
        return NextResponse.json({ error: "At least one image file is required." }, { status: 400, headers: corsHeaders });
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const cloudinaryUrl = await uploadToCloudinary(buffer, `gallery_${outletSlug}`);
          
          const fileTitle = files.length > 1 ? `${title} (${i + 1})` : title;
          entriesToCreate.push({
            title: fileTitle,
            description,
            outletName,
            outletSlug,
            imageUrl: cloudinaryUrl,
          });
        }
      }
    } else {
      // JSON body fallback
      const body = await request.json();
      const { title, description, outletName: rawOutlet, imageBase64, imageUrl } = body;
      const outletName = (rawOutlet || "Tuticorin Flagship Lounge").trim();
      const outletSlug = slugify(outletName);

      let finalUrl = imageUrl || "";

      if (imageBase64 && imageBase64.startsWith("data:image")) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        finalUrl = await uploadToCloudinary(buffer, `gallery_${outletSlug}`);
      }

      if (!finalUrl) {
        return NextResponse.json({ error: "Image file or valid image URL is required." }, { status: 400, headers: corsHeaders });
      }

      entriesToCreate.push({
        title: title || "Gallery Photo",
        description: description || "",
        outletName,
        outletSlug,
        imageUrl: finalUrl,
      });
    }

    if (entriesToCreate.length === 0) {
      return NextResponse.json({ error: "No valid images processed." }, { status: 400, headers: corsHeaders });
    }

    const result = await createGalleryImages(entriesToCreate);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully uploaded ${entriesToCreate.length} image(s) to Cloudinary.`,
        count: result.count,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[GALLERY POST ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload gallery image to cloud." },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID is required." }, { status: 400, headers: corsHeaders });
    }

    const result = await deleteGalleryImage(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete from DB." }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: "Image deleted successfully." }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error("[GALLERY DELETE ERROR]", error);
    return NextResponse.json({ error: error?.message || "Internal server error." }, { status: 500, headers: corsHeaders });
  }
}
