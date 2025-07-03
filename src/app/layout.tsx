import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLO5 - Mobile Trainer",
  description: "Master Pot-Limit Omaha 5-Card with our mobile-first training app. Practice wrap counting, equity estimation, and post-flop decision making.",
  keywords: ["PLO5", "poker", "training", "omaha", "wrap counter", "equity", "mobile"],
  authors: [{ name: "Anush" }],
  creator: "Anush",
  publisher: "PLO5 Training",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://plo5.vercel.app"),
  openGraph: {
    title: "PLO5 - Master Pot-Limit Omaha 5-Card",
    description: "Mobile-first training app for PLO-5 players. Practice wrap counting, equity estimation, and post-flop decision making with interactive quizzes.",
    url: "https://plo5.vercel.app",
    siteName: "PLO5 Mobile Trainer",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PLO5 Mobile Trainer - Master Pot-Limit Omaha 5-Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLO5 - Master Pot-Limit Omaha 5-Card",
    description: "Mobile-first training app for PLO-5 players. Practice wrap counting and equity estimation.",
    images: ["/og-image.svg"],
    creator: "@anush", // Replace with your actual Twitter handle
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#3b82f6" },
    ],
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
