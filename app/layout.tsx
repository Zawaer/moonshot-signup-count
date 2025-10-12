import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moonshot Signup Counter",
  description: "Realtime analytics for Moonshot signups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{scrollBehavior:'smooth'}}>
      <head>
        <link rel="stylesheet" href="/odometer-theme-default.css" />
      </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {children}
            <Analytics />
        </body>
    </html>
  );
}
