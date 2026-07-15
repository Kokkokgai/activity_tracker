import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "同步同路 · 半年计划",
  description: "修行进度追踪 —— 记录 20 个项目的完成度与用时",
};

export const viewport: Viewport = {
  themeColor: "#c1852c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <SiteNav />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-xs text-muted">
            愿精进不退 · 数据仅存于本浏览器，请定期在「数据」中导出备份
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
