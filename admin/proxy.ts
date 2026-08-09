import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that don't require authentication
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/seed", "/api/careers", "/api/contact", "/api/partnership", "/api/events"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle preflight CORS requests explicitly
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow public read access to the gallery API
  if (pathname === "/api/gallery" && request.method === "GET") {
    return NextResponse.next();
  }

  // Allow public read access to the products API for the frontend
  if (pathname === "/api/products" && request.method === "GET") {
    return NextResponse.next();
  }

  // Check for the admin token cookie
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = verifyToken(token);

  if (!payload) {
    // Token is invalid or expired — clear it and redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect everything except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
