"use client";

import { formatMinutes } from "@/lib/scoring";
import type { ActivityProgress } from "@/lib/types";

export function ActivityCard({
  progress,
  onOpen,
}: {
  progress: ActivityProgress;
  onOpen: () => void;
}) {
  const { def, count, minutes, done, fraction } = progress;
  const pct = Math.round(fraction * 100);

  return (
    <button
      onClick={onOpen}
      className="focusring group flex w-full flex-col rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-brand"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            done
              ? "bg-success text-white"
              : "bg-surface-2 text-muted ring-1 ring-border"
          }`}
        >
          {done ? "✓" : def.id}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-ink">{def.title}</h3>
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">
            {def.description}
          </p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className={done ? "font-medium text-success" : "text-muted"}>
            {def.type === "single"
              ? done
                ? "已完成"
                : "未开始"
              : `${Math.min(count, def.target)} / ${def.target} ${def.unit}`}
          </span>
          <span className="tnum text-muted">
            {minutes > 0 ? formatMinutes(minutes) : ""}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-all ${
              done ? "bg-success" : "bg-brand"
            }`}
            style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 text-xs font-medium text-brand-strong opacity-0 transition-opacity group-hover:opacity-100">
        点击记录 →
      </div>
    </button>
  );
}
