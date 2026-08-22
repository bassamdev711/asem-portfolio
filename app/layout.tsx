import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TechnicalFooter, TechnicalHeader } from "@/components/technical-chrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asem-portfolio-nine.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Asem Portfolio",
    default: "Asem Al-Manari | Software & Mobile Developer",
  },
  description:
    "Software and mobile developer building reliable digital products, practical tools, and clear technical experiences.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <TechnicalHeader />
        <div id="top">{children}</div>
        <TechnicalFooter />
      </body>
    </html>
  );
}
