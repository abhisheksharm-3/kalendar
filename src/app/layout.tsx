import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Kalendar";
const APP_DEFAULT_TITLE = "Kalendar - AI-Powered Smart Calendar App";
const APP_TITLE_TEMPLATE = "%s - Kalendar";
const APP_DESCRIPTION = "Optimize your schedule with Kalendar, an AI-driven calendar app that provides personalized insights and efficient time management.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  keywords: "calendar, AI scheduling, time management, productivity, smart calendar",
  authors: [{ name: "Xroden Tech" }],
  creator: "Xroden Tech",
  publisher: "Abhishek Sharma",
  category: "Productivity",
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: "https://kalendarapp.vercel.app",
    images: [
      {
        url: "/kalendar-header.png",
        width: 1200,
        height: 630,
        alt: "Kalendar App Screenshot",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
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
  themeColor: "#FFFFFF",
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden scrollbar-hide">
      <body className={inter.className}><Providers>{children}<Toaster /></Providers></body>
    </html>
  );
}