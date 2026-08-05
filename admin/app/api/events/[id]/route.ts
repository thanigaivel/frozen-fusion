import { NextResponse } from "next/server";
import { updateEventStatus, deleteEventBooking } from "@/lib/events-db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.status) {
      await updateEventStatus(id, body.status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EVENTS PATCH ERROR]", error);
    return NextResponse.json({ error: "Failed to update event booking." }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEventBooking(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EVENTS DELETE ERROR]", error);
    return NextResponse.json({ error: "Failed to delete event booking." }, { status: 500 });
  }
}
