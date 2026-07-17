"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useViewerRedirect } from "@/lib/useViewerRedirect";
import { CATEGORY_ORDER } from "@/lib/activities";
import type { ActivityDef } from "@/lib/types";
import { ScoreSummary } from "@/components/ScoreSummary";
import { ActivityCard } from "@/components/ActivityCard";
import { LogDialog } from "@/components/LogDialog";

const CATEGORY_HINT: Record<string, string> = {
  闻思: "读诵、听闻、思惟",
  修持: "定课、静坐、法会",
  艺术: "创作、彩绘、影音",
  身心: "素食、运动、锻炼",
  福德: "布施、供养、义工",
};

export default function DashboardPage() {
  const { compute } = useStore();
  const [active, setActive] = useState<ActivityDef | null>(null);
  const redirecting = useViewerRedirect();

  if (redirecting) return null; // 师父等围观者 → 排行榜

  return (
    <div className="space-y-8">
      <ScoreSummary />

      {CATEGORY_ORDER.map((cat) => {
        const items = compute.items.filter((i) => i.def.category === cat);
        if (items.length === 0) return null;
        const doneCount = items.filter((i) => i.done).length;
        return (
          <section key={cat}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-ink">
                {cat}
              </h2>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold text-muted">
                {doneCount}/{items.length}
              </span>
              <span className="stat-label ml-auto">{CATEGORY_HINT[cat]}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ActivityCard
                  key={p.def.id}
                  progress={p}
                  onOpen={() => setActive(p.def)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <LogDialog activity={active} onClose={() => setActive(null)} />
    </div>
  );
}
