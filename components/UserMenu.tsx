"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "./Modal";

export function UserMenu() {
  const { userName, signOut } = useStore();
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 6) {
      setMsg("密码至少 6 位。");
      return;
    }
    if (pw !== pw2) {
      setMsg("两次输入的密码不一致。");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      setMsg("修改失败：" + error.message);
      return;
    }
    setMsg("密码已修改。");
    setPw("");
    setPw2("");
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="focusring flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-bold text-ink hover:bg-surface-2"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">
            {userName?.slice(0, 1) ?? "?"}
          </span>
          {userName ?? "…"}
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
            <button
              onMouseDown={() => {
                setOpen(false);
                setMsg(null);
                setPwOpen(true);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-surface-2"
            >
              修改密码
            </button>
            <button
              onMouseDown={() => signOut()}
              className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-surface-2"
            >
              退出登录
            </button>
          </div>
        )}
      </div>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="修改密码">
        <form onSubmit={changePassword} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              新密码（至少 6 位）
            </span>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="new-password"
              className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              再输入一次
            </span>
            <input
              type="password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              autoComplete="new-password"
              className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          </label>
          {msg && (
            <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-ink">
              {msg}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="focusring w-full rounded-xl bg-brand px-4 py-2.5 font-bold text-white hover:bg-brand-strong disabled:opacity-50"
          >
            {busy ? "保存中…" : "保存新密码"}
          </button>
        </form>
      </Modal>
    </>
  );
}
