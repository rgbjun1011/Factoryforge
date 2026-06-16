import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "工坊智造 FactoryForge | 面向外贸工厂的 AI 素材工具",
  description: "AI 抠图 · 双语规格书 · 多语言目录 · 询盘报价单",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
