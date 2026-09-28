import type { Metadata } from "next";
import "./globals.css";
import "./travel.css";

export const metadata: Metadata = {
  title: "一起出走 · 朋友旅行手帐",
  description: "和朋友一起收藏地点、安排时间，共同完成旅行计划。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
