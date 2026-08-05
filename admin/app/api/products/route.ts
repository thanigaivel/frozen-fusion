import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const products = await getProducts(categoryId);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("[PRODUCTS GET ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, categoryId, categoryName, description, badge, rating, image, color, tags, visible } = body;

    if (!name || !categoryId || !categoryName) {
      return NextResponse.json({ error: "name, categoryId, and categoryName are required." }, { status: 400 });
    }

    const id = await createProduct({
      name,
      categoryId,
      categoryName,
      description: description || "",
      badge: badge || null,
      rating: rating || 4.5,
      image: image || "",
      color: color || "#60A5FA",
      tags: tags || [],
      visible: visible !== false,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS POST ERROR]", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
