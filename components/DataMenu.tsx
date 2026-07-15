"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import type { AppState, LogEntry } from "@/lib/types";
import { Modal } from "./Modal";

export function DataMenu() {
  const { logs, replaceAll, clearAll } = useStore();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function exportJson() {
    const state: AppState = { logs };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `同步同路-备份-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg(`已导出 ${logs.length} 条记录`);
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppState;
        const incoming: LogEntry[] = Array.isArray(parsed.logs)
          ? parsed.logs
          : [];
        if (!incoming.every((l) => typeof l.activityId === "number")) {
          throw new Error("格式不符");
        }
        const merge = window.confirm(
          `导入 ${incoming.length} 条记录。\n\n「确定」= 与现有记录合并\n「取消」= 覆盖现有记录`,
        );
        if (merge) {
          const existingIds = new Set(logs.map((l) => l.id));
          const merged = [
            ...logs,
            ...incoming.filter((l) => !existingIds.has(l.id)),
          ];
          replaceAll(merged);
          setMsg(`已合并，现共 ${merged.length} 条`);
        } else {
          replaceAll(incoming);
          setMsg(`已覆盖为 ${incoming.length} 条`);
        }
      } catch {
        setMsg("导入失败：文件不是有效的备份 JSON");
      }
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsText(file);
  }

  function onClear() {
    if (
      window.confirm("确定清空全部记录？此操作不可撤销，建议先导出备份。")
    ) {
      clearAll();
      setMsg("已清空全部记录");
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setMsg(null);
          setOpen(true);
        }}
        className="focusring rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-2"
      >
        数据
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="数据备份">
        <p className="mb-4 text-sm text-muted">
          全部记录只保存在这台设备的浏览器里。换设备、清缓存前，请先
          <span className="font-medium text-ink">导出 JSON</span> 备份。
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={exportJson}
            className="focusring rounded-xl border border-border bg-surface-2 px-4 py-3 text-left hover:border-brand"
          >
            <div className="font-medium text-ink">导出备份</div>
            <div className="text-xs text-muted">
              下载 {logs.length} 条记录为 .json
            </div>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="focusring rounded-xl border border-border bg-surface-2 px-4 py-3 text-left hover:border-brand"
          >
            <div className="font-medium text-ink">导入备份</div>
            <div className="text-xs text-muted">从 .json 恢复（可合并/覆盖）</div>
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onPickFile}
        />

        <button
          onClick={onClear}
          className="focusring mt-3 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-danger hover:bg-surface-2"
        >
          清空全部记录
        </button>

        {msg && (
          <p className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-strong">
            {msg}
          </p>
        )}
      </Modal>
    </>
  );
}
