# 后端设置指南（Supabase）

这个应用现在用 **Supabase** 做后端：每个人登录后有自己的记录，还有共享排行榜。
按下面 5 步走一遍就能跑起来。

---

## 1. 填环境变量

在 Supabase 后台 → **Project Settings → API** 里找到：

- **Project URL**
- **anon public** key
- **service_role** key（保密！）

把项目根目录的 `.env.local.example` 复制成 `.env.local`，填进去：

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的-anon-key
SUPABASE_SERVICE_ROLE_KEY=你的-service_role-key
```

> `SUPABASE_SERVICE_ROLE_KEY` 是超级权限密钥，只用于服务器（排行榜聚合、seed 脚本）。
> 绝不能加 `NEXT_PUBLIC_` 前缀，也不要提交到 git（`.env.local` 已被 gitignore）。

## 2. 建表（数据库结构）

Supabase 后台 → **SQL Editor** → 新建查询 → 把 [`supabase/schema.sql`](supabase/schema.sql)
全部内容粘进去 → **Run**。这会建 `players` 和 `logs` 两张表，并配好 RLS（每人只能读写自己的记录）。

## 3. 导入 15 位参与者（创建账号）

在项目根目录运行（Node 20+）：

```bash
node --env-file=.env.local scripts/seed.mjs
```

- 会创建 15 个账号，默认密码 **123456**，并写入 `players` 名单。
- 名字在 [`scripts/seed.mjs`](scripts/seed.mjs) 顶部的 `NAMES` 数组里——**要改名字就改这里再重跑**（幂等，不会重复建号）。

## 4. 本地运行

```bash
npm install
npm run dev
# 打开 http://localhost:3000 → 会跳到登录页
```

从下拉选自己的名字，输密码 `123456` 登录。登录后到右上角菜单可**改密码**。

## 5. 部署到 Vercel

1. 代码推到 GitHub，在 Vercel 导入该仓库。
2. Vercel 项目 → **Settings → Environment Variables**，加上同样的三个变量
   （`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`）。
3. Deploy。

---

## 常见问题

- **登录页显示「读取名单失败」**：还没跑第 2 步建表，或第 3 步 seed。
- **忘记密码**：在 Supabase 后台 → Authentication → Users 里找到该人，重置密码；或重跑 seed 会保持原密码（不会重置已存在账号）。
- **排行榜规则**：按总分排名（满分 20）；同分时，**越早达到该分数**的人排前面（依据达标那一刻的记录时间）。
- **照片存哪**：压缩后的图片直接存在 `logs.photo`（base64）。图片较大时可日后改用 Supabase Storage。
