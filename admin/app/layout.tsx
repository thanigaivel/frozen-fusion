import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frozen Fusion — Admin Panel",
  description: "Admin dashboard for Frozen Fusion brand management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
