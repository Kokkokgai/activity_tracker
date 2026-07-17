"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { progressFor, isWeekLogged, formatHours } from "@/lib/scoring";
import { compressImage } from "@/lib/image";
import type { ActivityDef } from "@/lib/types";
import { Modal } from "./Modal";
import { LogList } from "./LogList";

function todayLocal(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

// hours 类项目可选的时长：半小时 ~ 三小时
const HOUR_CHOICES = [0.5, 1, 1.5, 2, 2.5, 3];

export function LogDialog({
  activity,
  onClose,
}: {
  activity: ActivityDef | null;
  onClose: () => void;
}) {
  const { logs, addLog, removeLog } = useStore();
  const [date, setDate] = useState(todayLocal());
  const [hours, setHours] = useState<number>(1);
  const [note, setNote] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // 每次打开某项目时重置表单
  useEffect(() => {
    if (activity) {
      setDate(todayLocal());
      setHours(1);
      setNote("");
      setVideoUrl("");
      setPhoto("");
      setPhotoBusy(false);
    }
  }, [activity]);

  const progress = useMemo(
    () => (activity ? progressFor(activity, logs) : null),
    [activity, logs],
  );

  if (!activity || !progress) return null;

  const wantsProof = activity.requiresPhoto || activity.requiresGroupApproval;
  // 每周打卡：所选日期那一周是否已记录
  const weekTaken = !!activity.weekly && isWeekLogged(progress.logs, date);

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      setPhoto(await compressImage(file));
    } catch {
      setPhoto("");
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function save() {
    if (!activity) return;
    if (activity.weekly && isWeekLogged(progress?.logs ?? [], date)) return;
    addLog({
      activityId: activity.id,
      date: date || todayLocal(),
      hours: activity.type === "hours" ? hours : undefined,
      note: note.trim() || undefined,
      photo: photo || undefined,
      videoUrl: videoUrl.trim() || undefined,
    });
    // 保留日期，清空其余，方便连续记录
    setNote("");
    setVideoUrl("");
    setPhoto("");
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
          {activity.type === "hours"
            ? `进度 ${formatHours(progress.hours)}/${activity.target} ${activity.unit}`
            : `进度 ${Math.min(progress.count, activity.target)}/${activity.target} ${activity.unit}`}
        </span>
      </div>

      {activity.weekly && (
        <p className="mb-4 rounded-lg bg-surface-2 px-3 py-2 text-xs text-muted">
          每周打卡：同一周只能记录一次（代表那一周完成了）。多做只算精进，不额外加分。
        </p>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted">日期</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
      </label>

      {/* 时长选择（仅 hours 类项目，如弘法会） */}
      {activity.type === "hours" && (
        <div className="mt-3">
          <span className="mb-1.5 block text-xs font-medium text-muted">
            这次时长
          </span>
          <div className="flex flex-wrap gap-2">
            {HOUR_CHOICES.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setHours(h)}
                className={`focusring rounded-full border px-3 py-1.5 text-sm font-bold transition-colors ${
                  hours === h
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-muted hover:border-brand hover:text-ink"
                }`}
              >
                {h === 0.5 ? "半小时" : `${formatHours(h)} 小时`}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            累计满 {activity.target} 小时得 1 分 · 还差{" "}
            {formatHours(Math.max(0, activity.target - progress.hours))} 小时
          </p>
        </div>
      )}

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

      {/* 拍照证明 */}
      <div className="mt-3">
        <span className="mb-1 block text-xs font-medium text-muted">
          拍照证明（可选{activity.requiresPhoto ? "，此项建议拍照" : ""}）
        </span>
        {photo ? (
          <div className="relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt="证明照片"
              className="h-28 w-28 rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => setPhoto("")}
              className="focusring absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-xs text-white shadow"
              aria-label="移除照片"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoBusy}
            className="focusring flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-surface-2 text-xs text-muted hover:border-brand disabled:opacity-60"
          >
            {photoBusy ? (
              "处理中…"
            ) : (
              <>
                <span className="text-2xl leading-none">＋</span>
                拍照 / 选图
              </>
            )}
          </button>
        )}
        {/* 不要加 capture 属性：一旦加上，手机会直接开相机，
            不给「从相册选图」的选项。只留 accept，系统就会让用户二选一。 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickPhoto}
        />
      </div>

      {/* 视频 / 链接 */}
      <label className="mt-3 block">
        <span className="mb-1 block text-xs font-medium text-muted">
          视频 / 链接（可选）
        </span>
        <input
          type="url"
          placeholder="观看的视频链接 / 群消息链接…"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
        />
      </label>

      {wantsProof && (
        <p className="mt-2 text-xs text-muted">
          提示：此项{activity.requiresGroupApproval ? "需群组同意，" : ""}
          可拍照或附链接作为证明。
        </p>
      )}

      <button
        onClick={save}
        disabled={weekTaken}
        className="focusring mt-4 w-full rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted"
      >
        {activity.weekly
          ? weekTaken
            ? "✓ 本周已打卡"
            : "✓ 本周打卡"
          : "+ 保存这一次记录"}
      </button>

      {/* 历史记录：点一条可展开看大图与完整备注 */}
      {progress.logs.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 text-xs font-medium text-muted">
            已记录 {progress.logs.length} 次 · 点一条看详情
          </div>
          <LogList logs={progress.logs} onDelete={removeLog} />
        </div>
      )}
    </Modal>
  );
}
