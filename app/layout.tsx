import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const serif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const sans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "사회 브리핑 — 통합사회·일반사회 뉴스 아카이브",
  description:
    "2022 개정 교육과정 성취기준으로 읽는 오늘의 뉴스. 생각을 여는 기사만 골라 단원별로 싣습니다.",
  openGraph: {
    siteName: "사회 브리핑",
    type: "website",
    locale: "ko_KR",
    title: "사회 브리핑 — 통합사회·일반사회 뉴스 아카이브",
    description: "2022 개정 교육과정 성취기준으로 읽는 오늘의 뉴스. 매주 월~금 발행.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
