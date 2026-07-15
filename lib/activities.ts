import type { ActivityDef } from "./types";

// 计划期限：2026-07-15 → 2027-01-15（约 26 周）
export const PLAN_START = "2026-07-15";
export const PLAN_END = "2027-01-15";
export const PLAN_TITLE = "同步同路 · 半年计划";

// 20 个修行项目。所有 target / 单位都可在此调整。
// counted 类需做满 target 次才得 1 分；single 类记录 1 次即达标。
export const ACTIVITIES: ActivityDef[] = [
  {
    id: 1,
    title: "阅读高僧传 / 佛经",
    description:
      "阅读《佛陀十大弟子》；法鼓高僧传《法显大师》《密勒日巴》；佛光《佛图澄大师传》《道安大师传》《弘一大师传》。选其一作为读本。",
    type: "single",
    target: 1,
    unit: "本",
    category: "闻思",
  },
  {
    id: 2,
    title: "录制解说短视频",
    description: "录制一个 3-5 分钟「解释名相 / 课题」的短视频。",
    type: "single",
    target: 1,
    unit: "个",
    category: "艺术",
  },
  {
    id: 3,
    title: "听开示 / Podcast",
    description: "听佛法开示 / Podcast，每次至少十分钟，共 10 次。",
    type: "counted",
    target: 10,
    unit: "次",
    category: "闻思",
  },
  {
    id: 4,
    title: "彩绘佛 / 菩萨像",
    description: "彩绘一副佛、菩萨像（可去观音讲堂领取）。",
    type: "single",
    target: 1,
    unit: "副",
    category: "艺术",
  },
  {
    id: 5,
    title: "佛教艺术作品",
    description: "做一副关于佛教的艺术作品，放在群里让大家同意这是佛教艺术作品。",
    type: "single",
    target: 1,
    unit: "件",
    category: "艺术",
    requiresGroupApproval: true,
  },
  {
    id: 6,
    title: "阅读·成佛之道第四章",
    description: "阅读第四章成佛之道：四圣谛、八正道、十二因缘等核心教义。",
    type: "single",
    target: 1,
    unit: "章",
    category: "闻思",
  },
  {
    id: 7,
    title: "背《心经》/《吉祥经》",
    description: "背《心经》；已会了，就背《吉祥经》。",
    type: "single",
    target: 1,
    unit: "部",
    category: "修持",
  },
  {
    id: 8,
    title: "参与拜忏法会",
    description: "至少参与一次佛教拜忏法会。",
    type: "single",
    target: 1,
    unit: "次",
    category: "修持",
  },
  {
    id: 9,
    title: "禅三 / 佛三 / 禅七 / 佛七",
    description: "参与一次禅三、佛三、禅七、佛七，选其一。",
    type: "single",
    target: 1,
    unit: "次",
    category: "修持",
  },
  {
    id: 10,
    title: "法宝山学习营",
    description: "来法宝山学习营。",
    type: "single",
    target: 1,
    unit: "次",
    category: "闻思",
  },
  {
    id: 11,
    title: "素食（拍照发群）",
    description: "吃素食一个月四餐，要拍照发进群组。（半年目标 24 餐，可调）",
    type: "counted",
    target: 24,
    unit: "餐",
    category: "身心",
    requiresPhoto: true,
  },
  {
    id: 12,
    title: "早 / 晚课 · 念佛",
    description: "早 / 晚课 / 念佛号 / 念心经 / 吉祥经 10 分钟，6 个月达标 24 次。",
    type: "counted",
    target: 24,
    unit: "次",
    category: "修持",
  },
  {
    id: 13,
    title: "每周静坐",
    description: "每周一次静坐 15-30 分钟。（约 26 周）",
    type: "counted",
    target: 26,
    unit: "周",
    category: "修持",
  },
  {
    id: 14,
    title: "抄经",
    description:
      "抄 10 篇《心经》/ 10 遍《吉祥经》/ 1 遍《金刚经》/ 或者自己算字数。（默认 10 篇，可调）",
    type: "counted",
    target: 10,
    unit: "篇",
    category: "修持",
  },
  {
    id: 15,
    title: "每周有氧运动",
    description: "一个星期一次有氧运动 20 分钟。（约 26 周）",
    type: "counted",
    target: 26,
    unit: "周",
    category: "身心",
  },
  {
    id: 16,
    title: "每周重训",
    description:
      "一个星期一次 3 种徒手或非徒手重训运动，每种 3 set，1 set 10 下 / 30 秒。（约 26 周）",
    type: "counted",
    target: 26,
    unit: "周",
    category: "身心",
  },
  {
    id: 17,
    title: "布施 / 供僧",
    description: "布施 / 供僧一次。",
    type: "single",
    target: 1,
    unit: "次",
    category: "福德",
  },
  {
    id: 18,
    title: "弘法会 / 讲座 / 读书会",
    description:
      "至少参与 3 次弘法会 / 线上佛教讲座 / 读书会（共计至少 10 小时）。",
    type: "counted",
    target: 3,
    unit: "次",
    category: "闻思",
    minHours: 10,
  },
  {
    id: 19,
    title: "义工服务",
    description:
      "参与佛教团体 / 社会义工服务 5 次，一个项目算一次（一半以上于佛教团体）。",
    type: "counted",
    target: 5,
    unit: "次",
    category: "福德",
  },
  {
    id: 20,
    title: "拜佛 108 下",
    description: "拜佛 108 下，一次。",
    type: "single",
    target: 1,
    unit: "次",
    category: "福德",
  },
];

export const CATEGORY_ORDER: ActivityDef["category"][] = [
  "闻思",
  "修持",
  "艺术",
  "身心",
  "福德",
];

export function getActivity(id: number): ActivityDef | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
