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
  const hours = logs.reduce((s, l) => s + (l.hours ?? 0), 0);

  // hours 类（弘法会）看累计时长；其余看次数
  const progress = def.type === "hours" ? hours : count;
  const done = progress >= def.target;
  const fraction = def.target > 0 ? Math.min(progress / def.target, 1) : 0;

  return { def, count, hours, done, fraction, logs };
}

// 时长显示：2 → "2"，2.5 → "2.5"
export function formatHours(h: number): string {
  return Number.isInteger(h) ? String(h) : String(Math.round(h * 10) / 10);
}

// 统一的进度文案（卡片、计分表、他人主页共用）
export function progressText(p: ActivityProgress): string {
  const { def } = p;
  if (def.type === "hours") {
    return `${formatHours(p.hours)} / ${def.target} ${def.unit}`;
  }
  if (def.type === "single") return p.done ? "已完成" : "未开始";
  return `${Math.min(p.count, def.target)} / ${def.target} ${def.unit}`;
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

// 排行榜用：算一个人的总分，以及「达到当前分数的时间」（同分比先后）。
// 每完成一个项目 +1 分；某项目的完成时间 = 达标那一刻记录的 createdAt。
// 整体 reachedAt = 已达标项目里最晚的那个完成时间（= 拿到当前这一分的时刻）。
function ts(l: LogEntry): number {
  return Date.parse(l.createdAt ?? l.date);
}

export function reachedInfo(allLogs: LogEntry[]): {
  score: number;
  reachedAt: string | null;
} {
  let score = 0;
  let reachedAt: string | null = null;

  for (const def of ACTIVITIES) {
    const aLogs = allLogs
      .filter((l) => l.activityId === def.id)
      .sort((a, b) => ts(a) - ts(b));

    let completedAt: string | null = null;
    if (def.type === "hours") {
      // 累计时长跨过 target 的那一条记录，就是达标时刻
      let acc = 0;
      for (const l of aLogs) {
        acc += l.hours ?? 0;
        if (acc >= def.target) {
          completedAt = l.createdAt ?? l.date;
          break;
        }
      }
    } else if (def.weekly) {
      const seen = new Set<string>();
      for (const l of aLogs) {
        const wk = weekKey(l.date);
        if (!seen.has(wk)) {
          seen.add(wk);
          if (seen.size >= def.target) {
            completedAt = l.createdAt ?? l.date;
            break;
          }
        }
      }
    } else if (aLogs.length >= def.target) {
      const l = aLogs[def.target - 1];
      completedAt = l.createdAt ?? l.date;
    }

    if (completedAt) {
      score += 1;
      if (reachedAt === null || Date.parse(completedAt) > Date.parse(reachedAt)) {
        reachedAt = completedAt;
      }
    }
  }

  return { score, reachedAt };
}
