"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TimerState {
  running: boolean;
  seconds: number; // 已计时秒数
  start: () => void;
  pause: () => void;
  reset: () => void;
}

// 基于时间戳的计时器：即使标签页失焦，也按真实时间累计。
export function useTimer(): TimerState {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  // 本段开始的时间戳，以及此前累计的秒数
  const startedAt = useRef<number | null>(null);
  const accumulated = useRef(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const base = accumulated.current;
      const elapsed =
        startedAt.current != null ? (Date.now() - startedAt.current) / 1000 : 0;
      setSeconds(base + elapsed);
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    if (running) return;
    startedAt.current = Date.now();
    setRunning(true);
  }, [running]);

  const pause = useCallback(() => {
    if (!running) return;
    if (startedAt.current != null) {
      accumulated.current += (Date.now() - startedAt.current) / 1000;
    }
    startedAt.current = null;
    setRunning(false);
    setSeconds(accumulated.current);
  }, [running]);

  const reset = useCallback(() => {
    accumulated.current = 0;
    startedAt.current = null;
    setRunning(false);
    setSeconds(0);
  }, []);

  return { running, seconds, start, pause, reset };
}
