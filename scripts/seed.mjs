// 导入 15 位参与者：创建登录账号 + 写入 players 名单表。
// 运行：  node --env-file=.env.local scripts/seed.mjs
// 需要 .env.local 里有 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。
// 可重复运行（幂等）：已存在的账号不会重建。

import { createClient } from "@supabase/supabase-js";

// ⬇⬇ 参与者名单（按计划里的顺序）。若有名字打错，改这里再重跑即可。
const NAMES = [
  "郑轩屹",
  "颜善沁",
  "陈欣慧",
  "邱莉晶",
  "黄彦彰",
  "蔡博喻",
  "涂淑馨",
  "郭纹豪",
  "陈炜欣",
  "思晴",
  "翔赫",
  "颖绚",
  "伟新",
  "欣莹",
  "淑盈",
];

// ⬇⬇ 围观者：只看排行榜与大家的记录，自己不记录、不参与排名。
const VIEWERS = ["师父"];

const PASSWORD = "123456";
const DOMAIN = "tongbutonglu.app"; // 内部登录邮箱域名（无需真实存在）

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error(
    "缺少环境变量。请用：node --env-file=.env.local scripts/seed.mjs",
  );
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function existingEmailToId() {
  const map = new Map();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    for (const u of data.users) if (u.email) map.set(u.email, u.id);
    if (data.users.length < 1000) break;
    page += 1;
  }
  return map;
}

const existing = await existingEmailToId();

// 参与者 p01..p15（sort_order 1..15）+ 围观者 v01..（sort_order 100+，排在登录名单末尾）
const PEOPLE = [
  ...NAMES.map((name, i) => ({
    name,
    role: "player",
    email: `p${String(i + 1).padStart(2, "0")}@${DOMAIN}`,
    sort_order: i + 1,
  })),
  ...VIEWERS.map((name, i) => ({
    name,
    role: "viewer",
    email: `v${String(i + 1).padStart(2, "0")}@${DOMAIN}`,
    sort_order: 100 + i,
  })),
];

for (const p of PEOPLE) {
  let id = existing.get(p.email);

  if (!id) {
    const { data, error } = await admin.auth.admin.createUser({
      email: p.email,
      password: PASSWORD,
      email_confirm: true,
    });
    if (error) {
      console.error(`✗ 创建 ${p.name} 失败：`, error.message);
      continue;
    }
    id = data.user.id;
    console.log(`✓ 新建账号 ${p.name}  (${p.email})  [${p.role}]`);
  } else {
    console.log(`· 已存在   ${p.name}  (${p.email})  [${p.role}]`);
  }

  const { error: upErr } = await admin.from("players").upsert({
    id,
    name: p.name,
    email: p.email,
    role: p.role,
    sort_order: p.sort_order,
  });
  if (upErr) console.error(`✗ 写入 players（${p.name}）失败：`, upErr.message);
}

console.log(
  `\n完成：${NAMES.length} 位参与者 + ${VIEWERS.length} 位围观者。默认密码：${PASSWORD}`,
);
process.exit(0);
