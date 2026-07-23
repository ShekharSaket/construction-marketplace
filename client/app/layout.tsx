import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar"; // <-- 1. IMPORT THE NAVBAR

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Construction Marketplace",
  description: "Worker Booking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Maps to establish an early connection and speed up load time */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* 2. PLACE THE NAVBAR AT THE TOP OF THE BODY */}
        <Navbar />
        
        {/* All your other pages load right here */}
        {children}
      </body>
    </html>
  );
}