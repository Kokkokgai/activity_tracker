"use client";

import { useMemo } from "react";
import { computeAll } from "@/lib/scoring";
import { CATEGORY_ORDER } from "@/lib/activities";
import type { LogEntry } from "@/lib/types";
import { LogList } from "./LogList";

export function PlayerProgressView({
  name,
  logs,
  isMe,
}: {
  name: string;
  logs: LogEntry[];
  isMe: boolean;
}) {
  const { items, totals } = useMemo(() => computeAll(logs), [logs]);
  const pct = Math.round((totals.score / totals.max) * 100);

  return (
    <div className="space-y-6">
      {/* 头部：名字 + 总分 */}
      <section className="rounded-2xl border border-border bg-surface px-5 py-5 shadow-sm sm:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            {name}
          </h1>
          {isMe && (
            <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
              我
            </span>
          )}
        </div>

        <div className="mt-2 flex items-end gap-2">
          <span className="stat-num text-4xl text-brand">{totals.score}</span>
          <span className="mb-1 text-base font-semibold text-muted">
            / {totals.max} 分
          </span>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="stat-label mt-2">
          已达标 {totals.score} · 进行中 {totals.inProgress} · 共 {logs.length}{" "}
          条记录
        </div>
      </section>

      {/* 各项目进度 + 记录 */}
      {CATEGORY_ORDER.map((cat) => {
        const catItems = items.filter((i) => i.def.category === cat);
        if (catItems.length === 0) return null;
        const doneCount = catItems.filter((i) => i.done).length;
        return (
          <section key={cat}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-ink">
                {cat}
              </h2>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold text-muted">
                {doneCount}/{catItems.length}
              </span>
            </div>

            <div className="space-y-3">
              {catItems.map((i) => {
                const { def } = i;
                const p = Math.round(i.fraction * 100);
                const progressText =
                  def.type === "single"
                    ? i.done
                      ? "已完成"
                      : "未开始"
                    : `${Math.min(i.count, def.target)} / ${def.target} ${def.unit}`;
                return (
                  <div
                    key={def.id}
                    className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
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
                      {i.done && (
                        <span className="flex h-7 shrink-0 items-center rounded-full bg-success/12 px-2.5 text-xs font-bold text-success">
                          ✓ 达标
                        </span>
                      )}
                    </div>

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full ${
                          i.done ? "bg-success" : "bg-brand"
                        }`}
                        style={{ width: `${Math.max(p, i.count > 0 ? 6 : 0)}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div>
                        <div
                          className={`stat-num text-sm ${
                            i.done ? "text-success" : "text-ink"
                          }`}
                        >
                          {progressText}
                        </div>
                        <div className="stat-label mt-0.5">进度</div>
                      </div>
                    </div>

                    {i.logs.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-xs font-medium text-muted">
                          {i.logs.length} 条记录 · 点一条看详情
                        </div>
                        <LogList logs={i.logs} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
