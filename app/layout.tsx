import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RTB Device Management System",
  description: "Rwanda TVET Board Device Management Platform - Employable Skills for Sustainable Job Creation",
  keywords: ["RTB", "Rwanda", "TVET", "Device Management", "Education", "Technology"],
  authors: [{ name: "Rwanda TVET Board" }],
  themeColor: "#1B4F60",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "RTB Device Management System",
    description: "Rwanda TVET Board Device Management Platform",
    type: "website",
    locale: "en_US",
    siteName: "RTB Device Management",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/rtb-logo.png" />
        <meta name="theme-color" content="#1B4F72" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <AuthProvider>
          <div id="root" className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
