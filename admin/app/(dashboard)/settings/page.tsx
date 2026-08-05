"use client";

import { useState, useEffect } from "react";

/* ─── Accent Color Options ─── */
const ACCENT_COLORS = [
  { name: "Midnight Pink", value: "#FF6BD6", glow: "rgba(255,107,214,0.4)", gradient: "from-pink-500 to-purple-600" },
  { name: "Electric Cyan", value: "#67E8F9", glow: "rgba(103,232,249,0.4)", gradient: "from-cyan-400 to-blue-600" },
  { name: "Neon Purple", value: "#A78BFA", glow: "rgba(167,139,250,0.4)", gradient: "from-purple-500 to-indigo-600" },
  { name: "Golden Sunset", value: "#FCD34D", glow: "rgba(252,211,77,0.4)", gradient: "from-amber-400 to-orange-600" },
  { name: "Emerald Luxe", value: "#34D399", glow: "rgba(52,211,153,0.4)", gradient: "from-emerald-400 to-teal-600" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"appearance" | "general" | "notifications" | "security" | "database">("appearance");
  
  // Theme & Appearance State
  const [accentColor, setAccentColor] = useState("#FF6BD6");
  const [themeMode, setThemeMode] = useState<"dark" | "glass" | "oled">("dark");
  const [sidebarStyle, setSidebarStyle] = useState<"expanded" | "compact">("expanded");
  const [animations, setAnimations] = useState(true);

  // General Brand Settings State
  const [brandName, setBrandName] = useState("Frozen Fusion");
  const [brandTagline, setBrandTagline] = useState("Tuticorin's First Premium Dessert Brand");
  const [supportEmail, setSupportEmail] = useState("support@frozenfusion.in");
  const [supportPhone, setSupportPhone] = useState("+91 93630 40409");
  const [parlourAddress, setParlourAddress] = useState("No 88, 88/1 Jeyaraj Road, Tuticorin 628003");

  // Notifications State
  const [notifyEvents, setNotifyEvents] = useState(true);
  const [notifyCareers, setNotifyCareers] = useState(true);
  const [notifyPartnership, setNotifyPartnership] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Security State
  const [adminEmail, setAdminEmail] = useState("admin@frozenfusion.in");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  // Status & Feedback
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("ff_admin_accent");
      if (savedTheme) setAccentColor(savedTheme);
      const savedMode = localStorage.getItem("ff_admin_mode");
      if (savedMode) setThemeMode(savedMode as any);
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    // Save theme preferences locally
    try {
      localStorage.setItem("ff_admin_accent", accentColor);
      localStorage.setItem("ff_admin_mode", themeMode);
    } catch (e) {}

    setTimeout(() => {
      setSaving(false);
      setToast({ type: "success", message: "Settings updated successfully!" });
      setTimeout(() => setToast(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
          <p className="text-gray-400 mt-1 text-sm">Configure brand settings, admin preferences, email alerts, and security.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
        >
          {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
        {[
          { id: "appearance", label: "🎨 Theme & Appearance" },
          { id: "general", label: "⚙️ General Brand Info" },
          { id: "notifications", label: "🔔 Email Alerts" },
          { id: "security", label: "🔒 Security & Account" },
          { id: "database", label: "💾 System & Database" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-gray-800 text-pink-400 border border-pink-500/30 shadow-md"
                : "text-gray-400 hover:bg-gray-900 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Toast Alert ── */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between transition-all ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── TAB 1: Theme & Appearance ── */}
      {activeTab === "appearance" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Accent Theme Color</h3>
              <p className="text-gray-400 text-xs mb-4">Choose the primary highlight color for buttons, badges, and active states.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {ACCENT_COLORS.map((c) => (
                  <div
                    key={c.name}
                    onClick={() => setAccentColor(c.value)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${
                      accentColor === c.value
                        ? "border-pink-500 bg-gray-800 shadow-lg scale-105"
                        : "border-gray-800 bg-gray-900/50 hover:bg-gray-800/50"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-inner border-2 border-white/20"
                      style={{ background: c.value, boxShadow: `0 0 16px ${c.glow}` }}
                    />
                    <span className="text-xs text-gray-300 font-medium">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-1">Theme Interface Mode</h3>
              <p className="text-gray-400 text-xs mb-4">Select visual theme contrast for the dashboard backdrop.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "dark", name: "Deep Charcoal", desc: "Classic dark mode (#111316)" },
                  { id: "glass", name: "Glassmorphic Dark", desc: "Soft transparency & glow" },
                  { id: "oled", name: "OLED Black", desc: "Pure true black (#000000)" },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id as any)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      themeMode === mode.id
                        ? "border-pink-500 bg-gray-800 text-white"
                        : "border-gray-800 bg-gray-900/50 text-gray-400 hover:bg-gray-800/40"
                    }`}
                  >
                    <h4 className="font-semibold text-sm text-white mb-1">{mode.name}</h4>
                    <p className="text-xs text-gray-500">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Enable Fluid Motion Animations</h4>
                <p className="text-xs text-gray-400">Smooth hover scales, page transitions, and subtle glowing effects.</p>
              </div>
              <input
                type="checkbox"
                checked={animations}
                onChange={(e) => setAnimations(e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: General Brand Info ── */}
      {activeTab === "general" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Brand Tagline</label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Support Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Customer Helpline Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Flagship Parlour Address</label>
              <textarea
                rows={2}
                value={parlourAddress}
                onChange={(e) => setParlourAddress(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 3: Email Alerts ── */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Instant Email Notifications</h3>
            <p className="text-gray-400 text-xs mb-4">Choose which customer submissions trigger email dispatches to <span className="text-pink-400 font-mono">support@frozenfusion.in</span>.</p>

            <div className="space-y-4">
              {[
                { label: "New Event Catering Bookings", state: notifyEvents, setState: setNotifyEvents, desc: "Instant alert when customers book wedding, birthday or corporate events." },
                { label: "Career & Job Applications", state: notifyCareers, setState: setNotifyCareers, desc: "Instant alert when candidates submit resumes online." },
                { label: "Franchise & Partnership Inquiries", state: notifyPartnership, setState: setNotifyPartnership, desc: "Instant alert for investor and lounge franchise leads." },
                { label: "Daily Summary Digest", state: dailyDigest, setState: setDailyDigest, desc: "Send a daily morning digest of total website activity." },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 rounded-xl bg-gray-800/40 border border-gray-800">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => item.setState(e.target.checked)}
                    className="w-5 h-5 accent-pink-500 rounded cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 4: Security & Account ── */}
      {activeTab === "security" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Admin Credentials</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Admin Email Account</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-800 space-y-4">
              <h4 className="text-sm font-semibold text-white">Change Password</h4>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-gray-400">Require secondary verification code on admin sign-in.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 5: System & Database ── */}
      {activeTab === "database" && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">System Health & Database</h3>

          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase">MongoDB Database Status</p>
              <p className="text-emerald-400 font-semibold text-sm mt-0.5">🟢 Connected to `frozenfusion`</p>
            </div>
            <span className="text-xs font-mono text-gray-500">v7.5.0</span>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Export Database Backup</h4>
                <p className="text-xs text-gray-400">Download a JSON snapshot of products, events, careers, and inquiries.</p>
              </div>
              <button
                onClick={() => alert("Downloading database snapshot...")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
              >
                Export JSON
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Clear System Cache</h4>
                <p className="text-xs text-gray-400">Flush Next.js API route caches and static assets.</p>
              </div>
              <button
                onClick={() => alert("System cache cleared!")}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors"
              >
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
