import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { reachedInfo } from "@/lib/scoring";
import { ACTIVITIES } from "@/lib/activities";
import type { LeaderboardEntry, LogEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

type PlayerRow = { id: string; name: string; sort_order: number };
type LogRow = {
  user_id: string;
  activity_id: number;
  logged_on: string;
  created_at: string | null;
};

function formatReached(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const [{ data: players }, { data: logs }] = await Promise.all([
    admin
      .from("players")
      .select("id,name,sort_order")
      .order("sort_order", { ascending: true }),
    admin.from("logs").select("user_id,activity_id,logged_on,created_at"),
  ]);

  const logsByUser = new Map<string, LogEntry[]>();
  for (const r of (logs ?? []) as LogRow[]) {
    const arr = logsByUser.get(r.user_id) ?? [];
    arr.push({
      id: "",
      activityId: r.activity_id,
      date: r.logged_on,
      createdAt: r.created_at ?? undefined,
    });
    logsByUser.set(r.user_id, arr);
  }

  const entries: LeaderboardEntry[] = ((players ?? []) as PlayerRow[]).map(
    (p) => {
      const { score, reachedAt } = reachedInfo(logsByUser.get(p.id) ?? []);
      return { userId: p.id, name: p.name, score, reachedAt };
    },
  );

  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.reachedAt && b.reachedAt)
      return Date.parse(a.reachedAt) - Date.parse(b.reachedAt);
    if (a.reachedAt) return -1;
    if (b.reachedAt) return 1;
    return a.name.localeCompare(b.name);
  });

  const max = ACTIVITIES.length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">
          排行榜
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          按总分排名，满分 {max}。同分时，<span className="text-ink">越早达到</span>
          该分数的人排在前面。点任意一位可查看 TA 的进度与记录。
        </p>
      </div>

      <ol className="space-y-2">
        {entries.map((e, i) => {
          const isMe = e.userId === user?.id;
          const rank = i + 1;
          return (
            <li key={e.userId}>
              <Link
                href={`/leaderboard/${e.userId}`}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${
                  isMe ? "border-brand bg-brand-soft" : "border-border bg-surface"
                }`}
              >
                <div className="w-8 shrink-0 text-center">
                  {rank <= 3 ? (
                    <span className="text-xl">{MEDALS[rank - 1]}</span>
                  ) : (
                    <span className="stat-num text-base text-muted">{rank}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold text-ink">{e.name}</span>
                    {isMe && (
                      <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                        我
                      </span>
                    )}
                  </div>
                  <div className="stat-label mt-0.5">
                    {e.reachedAt
                      ? `达到于 ${formatReached(e.reachedAt)}`
                      : "尚未得分"}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="stat-num text-2xl text-brand">{e.score}</div>
                  <div className="stat-label">/ {max} 分</div>
                </div>

                <span className="shrink-0 text-muted" aria-hidden>
                  ›
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {entries.length === 0 && (
        <p className="rounded-2xl border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
          还没有参与者。请先在 Supabase 里运行 seed 脚本导入 15 人。
        </p>
      )}
    </div>
  );
}
