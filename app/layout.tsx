import type { Metadata } from "next";
import "./globals.css";

// 使用系统字体，避免Google Fonts网络依赖
const fontVariables = {
  '--font-inter': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--font-playfair': 'Georgia, "Times New Roman", Times, serif'
};

export const metadata: Metadata = {
  title: "Gallery | 现代艺术画廊",
  description: "沉浸式的现代艺术画廊体验，展示精美的油画和素描作品",
  keywords: "艺术画廊, 油画, 素描, 现代艺术, 画廊展览",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className="antialiased font-sans"
        style={{
          '--font-inter': fontVariables['--font-inter'],
          '--font-playfair': fontVariables['--font-playfair']
        } as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
