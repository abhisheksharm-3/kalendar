import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kalendar - AI-Powered Smart Calendar App",
  description: "Optimize your schedule with Kalendar, an AI-driven calendar app that provides personalized insights and efficient time management.",
  keywords: "calendar, AI scheduling, time management, productivity, smart calendar",
  authors: [{ name: "Xroden Tech" }],
  creator: "Xroden Tech",
  publisher: "Abhishek Sharma",
  applicationName: "Kalendar",
  category: "Productivity",
  openGraph: {
    title: "Kalendar - AI-Powered Smart Calendar App",
    description: "Optimize your schedule with Kalendar, an AI-driven calendar app that provides personalized insights and efficient time management.",
    url: "https://kalendarapp.vercel.app",
    siteName: "Kalendar",
    images: [
      {
        url: "/kalendar-header.png",
        width: 1200,
        height: 630,
        alt: "Kalendar App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    // card: "summary_large_image",
    title: "Kalendar - AI-Powered Smart Calendar App",
    description: "Optimize your schedule with Kalendar, an AI-driven calendar app that provides personalized insights and efficient time management.",
    images: ["/kalendar-header.png"],
    creator: "@xrodentech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden scrollbar-hide">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}