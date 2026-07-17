// 数据模型 —— 同步同路 · 半年计划

// single = 做 1 次即达标；counted = 做满 target 次；hours = 累计满 target 小时
export type ActivityType = "single" | "counted" | "hours";

export type Category = "闻思" | "修持" | "艺术" | "身心" | "福德";

export interface ActivityDef {
  id: number;
  title: string; // 简短标题
  description: string; // 完整说明（原计划文字）
  type: ActivityType;
  target: number; // single 恒为 1；counted = 目标次数；hours = 目标小时数
  unit: string; // 进度单位，如 次 / 篇 / 餐 / 周 / 小时
  category: Category;
  requiresPhoto?: boolean; // 需要拍照发群
  requiresGroupApproval?: boolean; // 需要群组同意
  weekly?: boolean; // 每周打卡：同一周只能记录一次
}

export interface LogEntry {
  id: string; // crypto.randomUUID() / DB uuid
  activityId: number;
  date: string; // YYYY-MM-DD（记录归属日期）
  hours?: number; // 仅 hours 类项目（如弘法会）：这一次的时长（0.5~3 小时）
  note?: string;
  photo?: string; // 拍照证明：压缩后的图片 data URL
  videoUrl?: string; // 观看视频 / 群消息等链接
  createdAt?: string; // 真实创建时间（ISO）——排行榜同分时比先后
}

// 排行榜单行
export interface LeaderboardEntry {
  userId: string;
  name: string;
  score: number;
  reachedAt: string | null; // 达到当前分数的时间（同分时越早越靠前）
}

export interface AppState {
  logs: LogEntry[];
}

// 派生的单项进度
export interface ActivityProgress {
  def: ActivityDef;
  count: number; // 已记录次数
  hours: number; // 累计时长（仅 hours 类项目有意义）
  done: boolean; // 是否达标（得分）
  fraction: number; // 0~1 进度
  logs: LogEntry[]; // 该项目的记录，按日期倒序
}
