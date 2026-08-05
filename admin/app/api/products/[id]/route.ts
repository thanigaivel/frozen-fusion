import { NextResponse } from "next/server";
import { updateProduct, deleteProduct, toggleProductVisibility } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.visible !== undefined && Object.keys(body).length === 1) {
      await toggleProductVisibility(id, body.visible);
    } else {
      await updateProduct(id, body);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCTS PATCH ERROR]", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCTS DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
