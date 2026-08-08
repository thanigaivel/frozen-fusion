import { Bungee, Poppins, Righteous } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CinematicBackground } from "@/components/CinematicBackground";

const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins", display: "swap" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee", display: "swap" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous", display: "swap" });

export const metadata = {
  title: "Frozen Fusion | Tuticorin's First Premium Dessert Brand",
  description: "Crafting the Finest Frozen Experiences. A luxury futuristic dessert lounge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased dark",
        poppins.variable,
        bungee.variable,
        righteous.variable
      )}
    >
      <body className="font-poppins bg-[#0A0A0D] text-white" suppressHydrationWarning>
        <SmoothScroll>
          <CinematicBackground />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
