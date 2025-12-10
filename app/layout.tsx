import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SillWriting",
  description: "A quiet space for writing. Pick a prompt and reflect.",
  openGraph: {
    title: "SillWriting",
    description: "A quiet space for writing. Pick a prompt and reflect.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SillWriting - Writing prompts",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SillWriting",
    description: "A quiet space for writing. Pick a prompt and reflect.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
