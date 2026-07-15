import { ACTIVITIES } from "./activities";
import type { ActivityDef, ActivityProgress, LogEntry } from "./types";

// 计算单个项目的进度
export function progressFor(
  def: ActivityDef,
  allLogs: LogEntry[],
): ActivityProgress {
  const logs = allLogs
    .filter((l) => l.activityId === def.id)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const count = logs.length;
  const done = count >= def.target;
  const fraction = def.target > 0 ? Math.min(count / def.target, 1) : 0;

  return { def, count, done, fraction, logs };
}

// 某天所在周（周一~周日）的唯一键 = 该周周一的日期。
// 用于「每周打卡」判断同一周是否已记录。
export function weekKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  const dayNr = (d.getDay() + 6) % 7; // 周一=0 … 周日=6
  d.setDate(d.getDate() - dayNr); // 回到本周周一
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 该项目在 dateStr 所在的那一周是否已有记录
export function isWeekLogged(
  logs: LogEntry[],
  dateStr: string,
): boolean {
  const key = weekKey(dateStr);
  return logs.some((l) => weekKey(l.date) === key);
}

export interface Totals {
  score: number; // 已达标项目数（= 得分）
  max: number; // 满分（项目总数）
  inProgress: number; // 已开始但未达标的项目数
}

export function computeAll(logs: LogEntry[]): {
  items: ActivityProgress[];
  totals: Totals;
} {
  const items = ACTIVITIES.map((def) => progressFor(def, logs));

  const score = items.filter((i) => i.done).length;
  const inProgress = items.filter((i) => !i.done && i.count > 0).length;

  return {
    items,
    totals: { score, max: ACTIVITIES.length, inProgress },
  };
}
