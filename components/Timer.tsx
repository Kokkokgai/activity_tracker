"use client";

import { useTimer } from "@/lib/useTimer";

function fmt(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

// 计时器：开始/暂停/清零，并可把用时（分钟，保留一位小数）填入表单。
export function Timer({ onApply }: { onApply: (minutes: number) => void }) {
  const { running, seconds, start, pause, reset } = useTimer();

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-muted">计时器</div>
          <div className="tnum text-3xl font-semibold text-ink">
            {fmt(seconds)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!running ? (
            <button
              type="button"
              onClick={start}
              className="focusring rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              ▶ 开始
            </button>
          ) : (
            <button
              type="button"
              onClick={pause}
              className="focusring rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              ⏸ 暂停
            </button>
          )}
          <button
            type="button"
            onClick={reset}
            className="focusring rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-ink"
          >
            清零
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={seconds < 1}
        onClick={() => onApply(Math.round((seconds / 60) * 10) / 10)}
        className="focusring mt-3 w-full rounded-lg border border-brand bg-brand-soft px-3 py-2 text-sm font-medium text-brand-strong hover:bg-brand-soft/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ↧ 填入用时（{Math.round((seconds / 60) * 10) / 10} 分）
      </button>
    </div>
  );
}
