import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "건강 나침반",
  description:
    "가까운 병원과 약국을 빠르게 검색하고, 사용자들과 정보를 나누는 커뮤니티입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
