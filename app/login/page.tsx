"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Player = { name: string; email: string };

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("players")
      .select("name,email")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setErr("读取名单失败，请确认数据库已初始化。");
          return;
        }
        const list = (data ?? []) as Player[];
        setPlayers(list);
        if (list[0]) setEmail(list[0].email);
      });
  }, [supabase]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErr("登录失败：名字或密码不对。");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image
            src="/icon/logo.png"
            alt="logo"
            width={48}
            height={48}
            priority
            className="h-12 w-12 rounded-xl object-cover"
          />
          <h1 className="font-kai text-3xl tracking-wide text-ink">同步同路</h1>
          <p className="stat-label">半年计划 · 登录</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              选择你的名字
            </span>
            <select
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            >
              {players.length === 0 && <option value="">加载中…</option>}
              {players.map((p) => (
                <option key={p.email} value={p.email}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">
              密码
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="首次登录默认 123456"
              autoComplete="current-password"
              className="focusring w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm"
            />
          </label>

          {err && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="focusring w-full rounded-xl bg-brand px-4 py-3 font-bold text-white hover:bg-brand-strong disabled:opacity-50"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted">
          首次登录密码为 <span className="font-semibold text-ink">123456</span>
          ，登录后请到右上角菜单修改密码。
        </p>
      </div>
    </div>
  );
}
