"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppState, LogEntry } from "./types";
import { computeAll } from "./scoring";

const STORAGE_KEY = "tongbu-tonglu:v1";

interface StoreValue {
  logs: LogEntry[];
  ready: boolean; // 是否已从 localStorage 载入（避免 SSR/首帧闪烁）
  addLog: (entry: Omit<LogEntry, "id">) => void;
  updateLog: (id: string, patch: Partial<Omit<LogEntry, "id">>) => void;
  removeLog: (id: string) => void;
  replaceAll: (logs: LogEntry[]) => void; // 导入用
  clearAll: () => void;
  compute: ReturnType<typeof computeAll>;
}

const StoreContext = createContext<StoreValue | null>(null);

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadInitial(): LogEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppState;
    return Array.isArray(parsed.logs) ? parsed.logs : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ready, setReady] = useState(false);

  // 挂载后从 localStorage 载入
  useEffect(() => {
    setLogs(loadInitial());
    setReady(true);
  }, []);

  // 变更时写回 localStorage
  useEffect(() => {
    if (!ready) return;
    try {
      const state: AppState = { logs };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 忽略写入失败（例如隐私模式配额限制）
    }
  }, [logs, ready]);

  const addLog = useCallback((entry: Omit<LogEntry, "id">) => {
    setLogs((prev) => [...prev, { ...entry, id: genId() }]);
  }, []);

  const updateLog = useCallback(
    (id: string, patch: Partial<Omit<LogEntry, "id">>) => {
      setLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      );
    },
    [],
  );

  const removeLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const replaceAll = useCallback((next: LogEntry[]) => {
    setLogs(next);
  }, []);

  const clearAll = useCallback(() => setLogs([]), []);

  const compute = useMemo(() => computeAll(logs), [logs]);

  const value: StoreValue = {
    logs,
    ready,
    addLog,
    updateLog,
    removeLog,
    replaceAll,
    clearAll,
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
