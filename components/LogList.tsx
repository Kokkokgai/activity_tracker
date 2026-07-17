"use client";

import { useState } from "react";
import type { LogEntry } from "@/lib/types";

// 记录列表：点一条可展开看大图 + 完整备注。
// 自己的记录传 onDelete 就会显示删除按钮；看别人的不传即可。
export function LogList({
  logs,
  onDelete,
}: {
  logs: LogEntry[];
  onDelete?: (id: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (logs.length === 0) return null;

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {logs.map((l) => {
        const open = openId === l.id;
        return (
          <li key={l.id} className="bg-surface">
            <div className="flex items-center gap-3 px-3 py-2 text-sm">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : l.id)}
                className="focusring flex min-w-0 flex-1 items-center gap-3 rounded text-left"
              >
                {l.photo ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={l.photo}
                    alt="证明照片"
                    className="h-9 w-9 shrink-0 rounded object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface-2 text-xs text-muted">
                    ✓
                  </span>
                )}
                <span className="tnum shrink-0 text-muted">{l.date}</span>
                {l.note && (
                  <span className="truncate text-ink">{l.note}</span>
                )}
                <span className="ml-auto shrink-0 text-xs font-medium text-brand-strong">
                  {open ? "收起" : "详情"}
                </span>
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(l.id)}
                  className="focusring shrink-0 rounded px-1.5 py-0.5 text-xs text-danger hover:bg-surface-2"
                  aria-label="删除这条记录"
                >
                  删除
                </button>
              )}
            </div>

            {open && (
              <div className="border-t border-border bg-surface-2 px-3 py-3">
                {l.photo && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={l.photo}
                    alt="证明照片"
                    className="mb-3 max-h-80 w-full rounded-lg border border-border object-contain"
                  />
                )}
                {l.note ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
                    {l.note}
                  </p>
                ) : (
                  !l.photo &&
                  !l.videoUrl && (
                    <p className="text-xs text-muted">这条没有备注、照片或链接。</p>
                  )
                )}
                {l.videoUrl && (
                  <a
                    href={l.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-brand-strong underline"
                  >
                    打开视频 / 链接 ↗
                  </a>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
