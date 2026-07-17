"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";

// 围观者（师父）不记录、没有自己的进度页 —— 进到主页/计分表就送去排行榜。
// 返回 true 表示正在跳转，页面可以先不渲染内容。
export function useViewerRedirect(): boolean {
  const { ready, isViewer } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (ready && isViewer) router.replace("/leaderboard");
  }, [ready, isViewer, router]);

  return ready && isViewer;
}
