import { NextResponse } from "next/server";
import { seedAdminUser } from "@/lib/admin-user";

export async function POST(request: Request) {
  // Security gate: only allow seeding if the secret matches
  const { email, password, secret } = await request.json();

  if (!process.env.ADMIN_SEED_SECRET || secret !== process.env.ADMIN_SEED_SECRET) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  const result = await seedAdminUser(email, password);

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 409 });
  }

  return NextResponse.json({ success: true, message: result.message });
}
