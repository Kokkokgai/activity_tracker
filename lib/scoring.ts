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
  const minutes = logs.reduce((sum, l) => sum + (l.minutes || 0), 0);

  // 达标判断：次数达标；#18 还需累计时长达标
  const countDone = count >= def.target;
  const hoursDone =
    def.minHours == null ? true : minutes >= def.minHours * 60;
  const done = countDone && hoursDone;

  // 进度：普通项目看次数；带 minHours 的取「次数进度」与「时长进度」的较小值
  let fraction = def.target > 0 ? Math.min(count / def.target, 1) : 0;
  if (def.minHours != null) {
    const hoursFraction = Math.min(minutes / (def.minHours * 60), 1);
    fraction = Math.min(fraction, hoursFraction);
  }

  return { def, count, minutes, done, fraction, logs };
}

export interface Totals {
  score: number; // 已达标项目数（= 得分）
  max: number; // 满分（项目总数）
  totalMinutes: number; // 全部项目累计用时
  scoredMinutes: number; // 已得分项目的累计用时
  minutesPerPoint: number; // 平均每分用时（分钟），基于已得分项目
}

export function computeAll(logs: LogEntry[]): {
  items: ActivityProgress[];
  totals: Totals;
} {
  const items = ACTIVITIES.map((def) => progressFor(def, logs));

  const score = items.filter((i) => i.done).length;
  const totalMinutes = items.reduce((s, i) => s + i.minutes, 0);
  const scoredMinutes = items
    .filter((i) => i.done)
    .reduce((s, i) => s + i.minutes, 0);
  const minutesPerPoint = score > 0 ? scoredMinutes / score : 0;

  return {
    items,
    totals: {
      score,
      max: ACTIVITIES.length,
      totalMinutes,
      scoredMinutes,
      minutesPerPoint,
    },
  };
}

// 把分钟数格式化为「X 小时 Y 分」/「Y 分」
export function formatMinutes(mins: number): string {
  const m = Math.round(mins);
  if (m <= 0) return "0 分";
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${r} 分`;
  if (r === 0) return `${h} 小时`;
  return `${h} 小时 ${r} 分`;
}
