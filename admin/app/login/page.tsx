"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden flex-col items-center justify-center p-16">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-600 opacity-20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-600 opacity-20 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500 opacity-10 blur-[80px]" />

        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Frozen Fusion
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Tuticorin's first premium dessert brand
          </p>
          <div className="mt-12 flex flex-col gap-4 text-left">
            {["Manage Products & Gallery", "Handle Partnership Inquiries", "Review Career Applications", "Send Newsletters"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-gray-500 text-sm">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Frozen Fusion
            </h1>
            <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">Admin access only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@frozenfusion.in"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-10">
            Frozen Fusion © {new Date().getFullYear()} · Authorised Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
