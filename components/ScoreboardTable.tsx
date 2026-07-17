"use client";

import { useStore } from "@/lib/store";
import { progressText } from "@/lib/scoring";
import type { ActivityDef } from "@/lib/types";

export function ScoreboardTable({
  onOpen,
}: {
  onOpen: (def: ActivityDef) => void;
}) {
  const { compute } = useStore();
  const { items, totals } = compute;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="stat-label px-3 py-3">项目</th>
            <th className="stat-label px-3 py-3">进度</th>
            <th className="stat-label px-3 py-3 text-center">得分</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const { def } = i;
            const text =
              def.type === "single" && !i.done ? "—" : progressText(i);
            return (
              <tr
                key={def.id}
                onClick={() => onOpen(def)}
                className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-2"
              >
                <td className="px-3 py-3">
                  <div className="font-semibold text-ink">{def.title}</div>
                  <div className="text-xs text-muted">{def.category}</div>
                </td>
                <td className="px-3 py-3 tnum text-muted">{text}</td>
                <td className="px-3 py-3 text-center">
                  {i.done ? (
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-success/15 px-2 text-xs font-bold text-success">
                      1
                    </span>
                  ) : (
                    <span className="text-muted">0</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-surface-2 font-bold">
            <td className="px-3 py-3" colSpan={2}>
              合计
            </td>
            <td className="px-3 py-3 text-center text-brand">
              {totals.score} / {totals.max}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
