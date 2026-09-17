import type { Metadata } from "next";
import Script from "next/script";
import { Bungee, Poppins, Righteous } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CinematicBackground } from "@/components/CinematicBackground";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FloatingSocialIcons } from "@/components/FloatingSocialIcons";

const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins", display: "swap" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-bungee", display: "swap" });
const righteous = Righteous({ weight: "400", subsets: ["latin"], variable: "--font-righteous", display: "swap" });

export const metadata: Metadata = {
  title: "Frozen Fusion | Tuticorin's First Premium Dessert Brand",
  description: "Crafting the Finest Frozen Experiences. A luxury futuristic dessert lounge.",
  verification: {
    google: "6j8njVdpEy2q81DIBcDXXLMvlH9pRuWroI5xV3ITMhE",
  },

  openGraph: {
    title: "Frozen Fusion | Premium Dessert Brand",
    description: "Crafting the Finest Frozen Experiences. A luxury futuristic dessert lounge in Tuticorin.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Frozen Fusion Logo",
      },
    ],
    type: "website",
  },
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5VWEJL23YY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5VWEJL23YY');
          `}
        </Script>
      </head>
      <body className="font-poppins bg-[#0A0A0D] text-white" suppressHydrationWarning>
        <SmoothScroll>
          <CinematicBackground />
          {children}
          <WhatsAppButton />
          <FloatingSocialIcons />
        </SmoothScroll>
      </body>
    </html>
  );
}
