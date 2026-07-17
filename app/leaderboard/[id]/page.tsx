import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PlayerProgressView } from "@/components/PlayerProgressView";
import type { LogEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

type LogRow = {
  id: string;
  activity_id: number;
  logged_on: string;
  note: string | null;
  photo: string | null;
  video_url: string | null;
  created_at: string | null;
};

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const [{ data: player }, { data: rows }] = await Promise.all([
    admin.from("players").select("id,name").eq("id", id).maybeSingle(),
    admin
      .from("logs")
      .select("id,activity_id,logged_on,note,photo,video_url,created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!player) notFound();

  const logs: LogEntry[] = ((rows ?? []) as LogRow[]).map((r) => ({
    id: r.id,
    activityId: r.activity_id,
    date: r.logged_on,
    note: r.note ?? undefined,
    photo: r.photo ?? undefined,
    videoUrl: r.video_url ?? undefined,
    createdAt: r.created_at ?? undefined,
  }));

  return (
    <div className="space-y-4">
      <Link
        href="/leaderboard"
        className="inline-block text-sm font-medium text-muted hover:text-ink"
      >
        ← 返回排行榜
      </Link>
      <PlayerProgressView
        name={player.name}
        logs={logs}
        isMe={user?.id === id}
      />
    </div>
  );
}
