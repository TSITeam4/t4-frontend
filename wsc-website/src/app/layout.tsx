import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import ClientLayout from "@/components/layout/client-layout";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://westernsalesclub.ca'),
  title: {
    default: 'Western Sales Club',
    template: '%s | Western Sales Club',
  },
  description: "Western University's premier student-run sales organization. Real-world experience, industry mentorship, and a community built on ambition.",
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://westernsalesclub.ca',
    siteName: 'Western Sales Club',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Western Sales Club',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
