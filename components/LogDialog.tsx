"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { progressFor, formatMinutes } from "@/lib/scoring";
import type { ActivityDef } from "@/lib/types";
import { Modal } from "./Modal";
import { Timer } from "./Timer";

function todayLocal(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function LogDialog({
  activity,
  onClose,
}: {
  activity: ActivityDef | null;
  onClose: () => void;
}) {
  const { logs, addLog, removeLog } = useStore();
  const [date, setDate] = useState(todayLocal());
  const [minutes, setMinutes] = useState<string>("");
  const [note, setNote] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  // 每次打开某项目时重置表单
  useEffect(() => {
    if (activity) {
      setDate(todayLocal());
      setMinutes("");
      setNote("");
      setProofUrl("");
    }
  }, [activity]);

  const progress = useMemo(
    () => (activity ? progressFor(activity, logs) : null),
    [activity, logs],
  );

  if (!activity || !progress) return null;

  const wantsProof = activity.requiresPhoto || activity.requiresGroupApproval;

  function save() {
    if (!activity) return;
    const mins = parseFloat(minutes);
    addLog({
      activityId: activity.id,
      date: date || todayLocal(),
      minutes: Number.isFinite(mins) && mins > 0 ? mins : 0,
      note: note.trim() || undefined,
      proofUrl: proofUrl.trim() || undefined,
    });
    // 保留日期，清空其余，方便连续记录
    setMinutes("");
    setNote("");
    setProofUrl("");
  }

  return (
    <Modal open={!!activity} onClose={onClose} title={activity.title}>
      <p className="mb-3 text-sm leading-relaxed text-muted">
        {activity.description}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`rounded-full px-2.5 py-1 font-medium ${
            progress.done
              ? "bg-success/15 text-success"
              : "bg-surface-2 text-muted"
          }`}
        >
          {progress.done ? "✓ 已达标 · 得 1 分" : "进行中 · 未得分"}
        </span>
        <span className="text-muted">
          进度 {Math.min(progress.count, activity.target)}/{activity.target}{" "}
          {activity.unit}
          {activity.minHours != null &&
            ` · 时长 ${formatMinutes(progress.minutes)}/${activity.minHours} 小时`}
          {activity.minHours == null &&
            ` · 累计 ${formatMinutes(progress.minutes)}`}
        </span>
      </div>

      <Timer onApply={(m) => setMinutes(String(m))} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">
            日期
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">
            用时（分钟）
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            placeholder="例如 15"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm tnum"
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-muted">
          备注（可选）
        </span>
        <input
          type="text"
          placeholder="做了什么、心得…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
      </label>

      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-muted">
          证明链接（可选{wantsProof ? "，此项需拍照 / 群组同意" : ""}）
        </span>
        <input
          type="url"
          placeholder="照片 / 视频 / 群消息链接"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
      </label>

      <button
        onClick={save}
        className="focusring mt-4 w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-strong"
      >
        + 保存这一次记录
      </button>

      {/* 历史记录 */}
      {progress.logs.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium text-muted">
            已记录 {progress.logs.length} 次
          </div>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {progress.logs.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-3 px-3 py-2 text-sm"
              >
                <span className="tnum text-muted">{l.date}</span>
                <span className="tnum font-medium text-ink">
                  {formatMinutes(l.minutes)}
                </span>
                {l.note && (
                  <span className="truncate text-muted" title={l.note}>
                    {l.note}
                  </span>
                )}
                {l.proofUrl && (
                  <a
                    href={l.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-strong underline"
                  >
                    链接
                  </a>
                )}
                <button
                  onClick={() => removeLog(l.id)}
                  className="focusring ml-auto rounded px-1.5 py-0.5 text-xs text-danger hover:bg-surface-2"
                  aria-label="删除这条记录"
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
