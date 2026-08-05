"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/", icon: "⊞" },
  { label: "Products", href: "/products", icon: "🍦" },
  { label: "Gallery", href: "/gallery", icon: "🖼" },
  { label: "Career", href: "/career", icon: "💼" },
  { label: "Contact", href: "/contact", icon: "✉" },
  { label: "Partnership", href: "/partnership", icon: "🤝" },
  { label: "Events", href: "/events", icon: "🎉" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const pageTitle =
    pathname === "/"
      ? "Overview"
      : pathname.replace("/", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 fixed h-full z-20">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
              Frozen Fusion
            </span>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/20"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-base font-semibold text-white">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">admin@frozenfusion.in</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
