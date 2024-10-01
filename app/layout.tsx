import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "あれこれ",
  description: "私用ブログサイト - 技術ネタ、買ったもの雑記、ゲーム等...",
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://blog-app2024-areyakoreya.vercel.app/',
    siteName: 'あれこれ',
    images: [
      {
        url: 'https://blog-app2024-areyakoreya.vercel.app/og-image.png', // OG画像のURLを設定
        width: 1200,
        height: 630,
        alt: 'あれこれ',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
