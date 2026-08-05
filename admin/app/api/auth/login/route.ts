import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/lib/admin-user";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await verifyAdminCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signToken({ email: user.email, id: user._id?.toString() });

    const response = NextResponse.json(
      { success: true, message: "Login successful." },
      { status: 200 }
    );

    // Set HTTP-only cookie so token is never accessible via JS
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
