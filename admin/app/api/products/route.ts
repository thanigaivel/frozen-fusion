import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/products-db";
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const products = await getProducts(categoryId);
    return NextResponse.json({ success: true, data: products }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("[PRODUCTS GET ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch products." }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const categoryId = formData.get("categoryId") as string;
    const categoryName = formData.get("categoryName") as string;
    const description = (formData.get("description") as string) || "";
    const badge = (formData.get("badge") as string) || null;
    const rating = parseFloat(formData.get("rating") as string) || 4.5;
    const color = (formData.get("color") as string) || "#60A5FA";
    const tags = JSON.parse((formData.get("tags") as string) || "[]");
    const visible = formData.get("visible") !== "false";
    const file = formData.get("image") as File | null;
    
    let imageUrl = (formData.get("imageUrl") as string) || "";

    if (!name || !categoryId || !categoryName) {
      return NextResponse.json({ error: "name, categoryId, and categoryName are required." }, { status: 400, headers: corsHeaders });
    }

    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageUrl = await uploadToCloudinary(buffer, categoryName);
      } catch (uploadError: any) {
        console.error("Cloudinary Upload Error:", uploadError);
        return NextResponse.json(
          { error: `Cloudinary upload failed: ${uploadError?.message || "Unknown error"}` },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    const id = await createProduct({
      name,
      categoryId,
      categoryName,
      description,
      badge,
      rating,
      image: imageUrl,
      color,
      tags,
      visible,
    });

    return NextResponse.json({ success: true, id, imageUrl }, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error("[PRODUCTS POST ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to create product." }, { status: 500, headers: corsHeaders });
  }
}
