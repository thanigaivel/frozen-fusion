import { Bungee, Fredoka, Righteous, Poppins, Montserrat, Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CinematicBackground } from "@/components/CinematicBackground";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous" });

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
        inter.variable,
        poppins.variable,
        montserrat.variable,
        bungee.variable,
        fredoka.variable,
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
