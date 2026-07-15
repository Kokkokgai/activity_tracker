"use client";

import { useStore } from "@/lib/store";
import { formatMinutes } from "@/lib/scoring";
import type { ActivityDef } from "@/lib/types";

export function ScoreboardTable({
  onOpen,
}: {
  onOpen: (def: ActivityDef) => void;
}) {
  const { compute } = useStore();
  const { items, totals } = compute;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted">
            <th className="px-3 py-3 font-medium">#</th>
            <th className="px-3 py-3 font-medium">项目</th>
            <th className="px-3 py-3 font-medium">进度</th>
            <th className="px-3 py-3 text-center font-medium">得分</th>
            <th className="px-3 py-3 text-right font-medium">累计用时</th>
            <th className="px-3 py-3 text-right font-medium">每分用时</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const { def } = i;
            const progressText =
              def.type === "single"
                ? i.done
                  ? "已完成"
                  : "—"
                : `${Math.min(i.count, def.target)}/${def.target} ${def.unit}`;
            return (
              <tr
                key={def.id}
                onClick={() => onOpen(def)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-2"
              >
                <td className="px-3 py-3 tnum text-muted">{def.id}</td>
                <td className="px-3 py-3">
                  <div className="font-medium text-ink">{def.title}</div>
                  <div className="text-xs text-muted">{def.category}</div>
                </td>
                <td className="px-3 py-3 tnum text-muted">
                  {progressText}
                  {def.minHours != null && (
                    <span className="block text-xs">
                      {formatMinutes(i.minutes)}/{def.minHours}h
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-center">
                  {i.done ? (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-success/15 px-2 text-xs font-semibold text-success">
                      1
                    </span>
                  ) : (
                    <span className="text-muted">0</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right tnum text-ink">
                  {i.minutes > 0 ? formatMinutes(i.minutes) : "—"}
                </td>
                <td className="px-3 py-3 text-right tnum text-ink">
                  {i.done ? formatMinutes(i.minutes) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-surface-2 font-medium">
            <td className="px-3 py-3" colSpan={3}>
              合计
            </td>
            <td className="px-3 py-3 text-center text-brand-strong">
              {totals.score} / {totals.max}
            </td>
            <td className="px-3 py-3 text-right tnum">
              {formatMinutes(totals.totalMinutes)}
            </td>
            <td className="px-3 py-3 text-right tnum">
              {totals.score > 0
                ? `均 ${formatMinutes(totals.minutesPerPoint)}`
                : "—"}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
