// 数据模型 —— 同步同路 · 半年计划

export type ActivityType = "single" | "counted";

export type Category = "闻思" | "修持" | "艺术" | "身心" | "福德";

export interface ActivityDef {
  id: number;
  title: string; // 简短标题
  description: string; // 完整说明（原计划文字）
  type: ActivityType; // single = 一次达标；counted = 做满 target 次达标
  target: number; // single 恒为 1；counted 为目标次数
  unit: string; // 进度单位，如 次 / 篇 / 餐 / 周
  category: Category;
  requiresPhoto?: boolean; // 需要拍照发群
  requiresGroupApproval?: boolean; // 需要群组同意
  weekly?: boolean; // 每周打卡：同一周只能记录一次
}

export interface LogEntry {
  id: string; // crypto.randomUUID()
  activityId: number;
  date: string; // YYYY-MM-DD
  note?: string;
  photo?: string; // 拍照证明：压缩后的图片 data URL
  videoUrl?: string; // 观看视频 / 群消息等链接
}

export interface AppState {
  logs: LogEntry[];
}

// 派生的单项进度
export interface ActivityProgress {
  def: ActivityDef;
  count: number; // 已记录次数（单位次数）
  done: boolean; // 是否达标（得分）
  fraction: number; // 0~1 进度
  logs: LogEntry[]; // 该项目的记录，按日期倒序
}
