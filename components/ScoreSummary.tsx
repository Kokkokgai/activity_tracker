"use client";

import { useStore } from "@/lib/store";
import { formatMinutes } from "@/lib/scoring";
import { PLAN_END, PLAN_START } from "@/lib/activities";

function Ring({ score, max }: { score: number; max: number }) {
  const size = 108;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? score / max : 0;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .5s ease" }}
      />
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        className="tnum fill-[var(--ink)] text-2xl font-bold"
      >
        {score}
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        className="fill-[var(--muted)] text-xs"
      >
        / {max} 分
      </text>
    </svg>
  );
}

function daysLeft(): number {
  const end = new Date(PLAN_END + "T23:59:59");
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

export function ScoreSummary() {
  const { compute, ready } = useStore();
  const { totals } = compute;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Ring score={ready ? totals.score : 0} max={totals.max} />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-ink">
            我的修行进度
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {PLAN_START} → {PLAN_END} · 还剩 {daysLeft()} 天
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Stat label="累计用时" value={formatMinutes(totals.totalMinutes)} />
            <Stat
              label="每分用时"
              value={
                totals.score > 0
                  ? formatMinutes(totals.minutesPerPoint)
                  : "—"
              }
            />
            <Stat label="已得分" value={`${totals.score} / ${totals.max}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 px-2 py-3">
      <div className="tnum text-base font-semibold text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
