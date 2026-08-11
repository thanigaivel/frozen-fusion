import { NextResponse } from "next/server";
import { updateProduct, deleteProduct, toggleProductVisibility } from "@/lib/products-db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";

    let updateData: Record<string, any> = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("image") as File | null;
      const categoryName = (formData.get("categoryName") as string) || "general";

      formData.forEach((value, key) => {
        if (key !== "image") {
          if (key === "rating") updateData.rating = parseFloat(value as string);
          else if (key === "tags") {
            try { updateData.tags = JSON.parse(value as string); } catch { updateData.tags = []; }
          } else if (key === "visible") updateData.visible = value !== "false";
          else updateData[key] = value;
        }
      });

      if (file && file.size > 0) {
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          updateData.image = await uploadToCloudinary(buffer, categoryName);
        } catch (uploadError: any) {
          console.error("Cloudinary Upload Error during PATCH:", uploadError);
          return NextResponse.json(
            { error: `Cloudinary upload failed: ${uploadError?.message || "Unknown error"}` },
            { status: 500, headers: corsHeaders }
          );
        }
      }
    } else {
      updateData = await request.json();
    }

    if (updateData.visible !== undefined && Object.keys(updateData).length === 1) {
      await toggleProductVisibility(id, updateData.visible);
    } else {
      await updateProduct(id, updateData);
    }

    return NextResponse.json({ success: true, data: updateData }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PRODUCTS PATCH ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to update product." }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PRODUCTS DELETE ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to delete product." }, { status: 500, headers: corsHeaders });
  }
}
