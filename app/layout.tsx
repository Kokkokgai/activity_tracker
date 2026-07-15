import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SiteNav } from "@/components/SiteNav";
import { PersistErrorBanner } from "@/components/PersistErrorBanner";

export const metadata: Metadata = {
  title: "同步同路 · 半年计划",
  description: "修行进度追踪 —— 记录 20 个项目的完成进度",
};

export const viewport: Viewport = {
  themeColor: "#fc4c02",
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
          <PersistErrorBanner />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 sm:px-6">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
