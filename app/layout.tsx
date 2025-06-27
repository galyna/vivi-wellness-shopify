import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.tsx или app/page.tsx
export const metadata: Metadata = {
  title: "Vivi Wellness — Find Your Balance Every Day",
  description: "Wellness routines, healthy recipes, and curated products. Vivi is your everyday AI wellness companion for better sleep, nutrition, yoga, relaxation, and energy.",
  keywords: [
    "wellness",
    "healthy lifestyle",
    "nutrition",
    "yoga",
    "relaxation",
    "sleep",
    "energy",
    "AI assistant",
    "Vivi"
  ],
  authors: [{ name: "Vivi Team" }],
  openGraph: {
    title: "Vivi Wellness — Your Everyday AI Wellness Companion",
    description: "Wellness routines, recipes, and products to help you find balance, joy, and healthy habits every day — with Vivi.",
    url: "https://your-vivi-app.com",
    siteName: "Vivi Wellness",
    images: [
      {
        url: "https://your-vivi-app.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vivi Wellness App Preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  themeColor: "#b5f5e6"
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-softgray`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
