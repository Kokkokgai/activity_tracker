// 导入 15 位参与者：创建登录账号 + 写入 players 名单表。
// 运行：  node --env-file=.env.local scripts/seed.mjs
// 需要 .env.local 里有 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY。
// 可重复运行（幂等）：已存在的账号不会重建。

import { createClient } from "@supabase/supabase-js";

// ⬇⬇ 名单（按计划里的顺序）。若有名字打错，改这里再重跑即可。
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

for (let i = 0; i < NAMES.length; i++) {
  const name = NAMES[i];
  const email = `p${String(i + 1).padStart(2, "0")}@${DOMAIN}`;
  let id = existing.get(email);

  if (!id) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
    });
    if (error) {
      console.error(`✗ 创建 ${name} 失败：`, error.message);
      continue;
    }
    id = data.user.id;
    console.log(`✓ 新建账号 ${name}  (${email})`);
  } else {
    console.log(`· 已存在   ${name}  (${email})`);
  }

  const { error: upErr } = await admin
    .from("players")
    .upsert({ id, name, email, sort_order: i + 1 });
  if (upErr) console.error(`✗ 写入 players（${name}）失败：`, upErr.message);
}

console.log(`\n完成，共 ${NAMES.length} 人。默认密码：${PASSWORD}`);
process.exit(0);
