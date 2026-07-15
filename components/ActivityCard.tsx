"use client";

import type { ActivityProgress } from "@/lib/types";

export function ActivityCard({
  progress,
  onOpen,
}: {
  progress: ActivityProgress;
  onOpen: () => void;
}) {
  const { def, count, done, fraction } = progress;
  const pct = Math.round(fraction * 100);
  const progressText =
    def.type === "single"
      ? done
        ? "已完成"
        : "未开始"
      : `${Math.min(count, def.target)} / ${def.target} ${def.unit}`;

  return (
    <div
      onClick={onOpen}
      className="flex cursor-pointer flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-bold text-ink">{def.title}</h3>
            {def.weekly && (
              <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                每周打卡
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
            {def.description}
          </p>
        </div>
        {done && (
          <span className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-success/12 px-2.5 text-xs font-bold text-success">
            ✓ 达标
          </span>
        )}
      </div>

      {/* 进度条 */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all ${
            done ? "bg-success" : "bg-brand"
          }`}
          style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
        />
      </div>

      {/* 底部：进度 + 记录按钮 */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <div
            className={`stat-num text-sm ${done ? "text-success" : "text-ink"}`}
          >
            {progressText}
          </div>
          <div className="stat-label mt-0.5">进度</div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="focusring inline-flex items-center gap-1 rounded-full bg-brand px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-strong"
        >
          <span className="text-base leading-none">＋</span>
          {def.weekly ? "打卡" : "记录"}
        </button>
      </div>
    </div>
  );
}
