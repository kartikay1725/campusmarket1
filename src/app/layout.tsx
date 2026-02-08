import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

export const metadata: Metadata = {
  title: "CampusMarket - Buy & Sell Used Goods (IPU Students Only)",
  description: "The trusted marketplace for IPU (Indraprastha University) students to buy and sell used books, electronics, and college essentials at the lowest prices. Resell your goods directly to fellow students within your campus.",
  keywords: ["IPU marketplace", "Indraprastha University", "student marketplace", "buy sell used goods", "college resale", "cheap student books", "IPU campus market"],
  openGraph: {
    title: "CampusMarket - IPU Student Marketplace",
    description: "Buy and sell used goods at the lowest prices. Exclusively for IPU students.",
    type: "website",
    locale: "en_IN",
    url: "https://campusmarket.in", // Placeholder, user can update
    siteName: "CampusMarket",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusMarket - IPU Student Marketplace",
    description: "The best place for IPU students to resell their goods at affordable prices.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

