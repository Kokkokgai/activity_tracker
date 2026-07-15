"use client";

import { useStore } from "@/lib/store";
import { PLAN_END, PLAN_START } from "@/lib/activities";

const DAY = 86400000;

function planTiming() {
  const start = new Date(PLAN_START + "T00:00:00").getTime();
  const end = new Date(PLAN_END + "T23:59:59").getTime();
  const now = Date.now();
  const total = Math.max(1, end - start);
  const elapsed = Math.min(Math.max(now - start, 0), total);
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  return { elapsedFraction: elapsed / total, daysLeft };
}

function Dial({
  fraction,
  color,
  value,
  caption,
  label,
}: {
  fraction: number;
  color: string;
  value: string;
  caption?: string;
  label: string;
}) {
  const size = 132;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(Math.max(fraction, 0), 1);
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="stat-num text-4xl text-ink">{value}</span>
          {caption && (
            <span className="mt-0.5 text-xs font-medium text-muted">
              {caption}
            </span>
          )}
        </div>
      </div>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export function ScoreSummary() {
  const { compute, ready } = useStore();
  const { totals } = compute;
  const score = ready ? totals.score : 0;
  // planTiming() 依赖 Date.now()，只有挂载后（ready）才计算，
  // 否则服务端与客户端首帧不一致会导致 hydration 报错。
  const { elapsedFraction, daysLeft } = ready
    ? planTiming()
    : { elapsedFraction: 0, daysLeft: 0 };

  return (
    <section className="rounded-2xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="stat-label">半年计划 · 进度</span>
        <span className="text-xs font-medium text-muted">
          {PLAN_START} → {PLAN_END}
        </span>
      </div>

      <div className="flex items-center justify-center gap-8 sm:gap-14">
        <Dial
          fraction={score / totals.max}
          color="var(--brand)"
          value={`${score}`}
          caption={`/ ${totals.max} 分`}
          label="总进度"
        />
        <Dial
          fraction={elapsedFraction}
          color="var(--muted)"
          value={ready ? `${daysLeft}` : "—"}
          caption="天"
          label="剩余天数"
        />
      </div>
    </section>
  );
}
