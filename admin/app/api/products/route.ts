import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/products-db";
import { promises as fs } from "fs";
import path from "path";

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
    
    let imageUrl = formData.get("imageUrl") as string || "";

    if (!name || !categoryId || !categoryName) {
      return NextResponse.json({ error: "name, categoryId, and categoryName are required." }, { status: 400 });
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      
      const uploadDir = path.join(process.cwd(), "../frozen-fusion/public/products", categoryName);
      const filePath = path.join(uploadDir, fileName);
      
      // Ensure directory exists (fallback in case it wasn't created)
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      await fs.writeFile(filePath, buffer);
      imageUrl = `/products/${categoryName}/${fileName}`;
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

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("[PRODUCTS POST ERROR]", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
