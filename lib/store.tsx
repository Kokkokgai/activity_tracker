"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LogEntry } from "./types";
import { computeAll } from "./scoring";

interface StoreValue {
  ready: boolean; // 初始加载完成
  userId: string | null;
  userName: string | null;
  isViewer: boolean; // 围观者（如师父）：只看排行榜，不记录、不排名
  logs: LogEntry[];
  error: string | null;
  addLog: (entry: Omit<LogEntry, "id" | "createdAt">) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  compute: ReturnType<typeof computeAll>;
}

const StoreContext = createContext<StoreValue | null>(null);

type Row = {
  id: string;
  activity_id: number;
  logged_on: string;
  note: string | null;
  photo: string | null;
  video_url: string | null;
  created_at: string | null;
};

function mapRow(r: Row): LogEntry {
  return {
    id: r.id,
    activityId: r.activity_id,
    date: r.logged_on,
    note: r.note ?? undefined,
    photo: r.photo ?? undefined,
    videoUrl: r.video_url ?? undefined,
    createdAt: r.created_at ?? undefined,
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isViewer, setIsViewer] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const loadedFor = useRef<string | null>(null);

  const loadFor = useCallback(
    async (uid: string) => {
      loadedFor.current = uid;
      const [{ data: player }, { data: rows, error: logErr }] =
        await Promise.all([
          supabase
            .from("players")
            .select("name,role")
            .eq("id", uid)
            .maybeSingle(),
          supabase
            .from("logs")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: true }),
        ]);
      setUserId(uid);
      setUserName(player?.name ?? "我");
      setIsViewer(player?.role === "viewer");
      setLogs(logErr ? [] : (rows as Row[]).map(mapRow));
      if (logErr) setError("读取记录失败：" + logErr.message);
    },
    [supabase],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (user) await loadFor(user.id);
      setReady(true);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const uid = session?.user?.id ?? null;
      if (event === "SIGNED_OUT" || !uid) {
        loadedFor.current = null;
        setUserId(null);
        setUserName(null);
        setIsViewer(false);
        setLogs([]);
      } else if (uid !== loadedFor.current) {
        loadFor(uid);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadFor]);

  const addLog = useCallback(
    async (entry: Omit<LogEntry, "id" | "createdAt">) => {
      if (!userId) return;
      const tempId = `temp-${Date.now()}`;
      const optimistic: LogEntry = {
        ...entry,
        id: tempId,
        createdAt: new Date().toISOString(),
      };
      setLogs((prev) => [...prev, optimistic]);

      const { data, error: insErr } = await supabase
        .from("logs")
        .insert({
          user_id: userId,
          activity_id: entry.activityId,
          logged_on: entry.date,
          note: entry.note ?? null,
          photo: entry.photo ?? null,
          video_url: entry.videoUrl ?? null,
        })
        .select()
        .single();

      if (insErr || !data) {
        setLogs((prev) => prev.filter((l) => l.id !== tempId));
        setError("保存失败：" + (insErr?.message ?? "未知错误"));
        return;
      }
      const saved = mapRow(data as Row);
      setLogs((prev) => prev.map((l) => (l.id === tempId ? saved : l)));
    },
    [supabase, userId],
  );

  const removeLog = useCallback(
    async (id: string) => {
      const prev = logs;
      setLogs((cur) => cur.filter((l) => l.id !== id));
      if (id.startsWith("temp-")) return;
      const { error: delErr } = await supabase.from("logs").delete().eq("id", id);
      if (delErr) {
        setLogs(prev); // 回滚
        setError("删除失败：" + delErr.message);
      }
    },
    [supabase, logs],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    loadedFor.current = null;
    setUserId(null);
    setUserName(null);
    setIsViewer(false);
    setLogs([]);
    router.push("/login");
    router.refresh();
  }, [supabase, router]);

  const compute = useMemo(() => computeAll(logs), [logs]);

  const value: StoreValue = {
    ready,
    userId,
    userName,
    isViewer,
    logs,
    error,
    addLog,
    removeLog,
    signOut,
    compute,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
