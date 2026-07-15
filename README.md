# 同步同路 · 半年计划 — 修行进度追踪

追踪 20 个修行项目的完成进度。每个项目达标得 1 分，满分 20；含计分表，可拍照 / 附链接作为证明。数据保存在浏览器本地（localStorage），可导出 / 导入 JSON 备份。

> 计划期限：2026-07-15 → 2027-01-15

## 本地运行

```bash
npm install
npm run dev
# 打开 http://localhost:3000
```

其他命令：`npm run build`（生产构建）、`npm run start`（跑构建产物）。

## 部署到 Vercel

**方式一：GitHub + Vercel（推荐）**

```bash
git add -A && git commit -m "init"
# 在 GitHub 新建仓库后：
git remote add origin <你的仓库地址>
git push -u origin main
```

然后到 [vercel.com](https://vercel.com) → New Project → 导入该仓库 → Deploy。框架会自动识别为 Next.js，无需任何环境变量。

**方式二：Vercel CLI**

```bash
npm i -g vercel
vercel          # 首次，按提示登录 / 关联项目
vercel --prod   # 部署到生产
```

## 使用说明

- **主页**：顶部总分与进度条 + 已达标 / 进行中 / 剩余天数；下方按「闻思 / 修持 / 艺术 / 身心 / 福德」分组的项目卡片。点卡片记录一次。
- **记录**：填日期、备注；可**拍照 / 选图**作为证明（自动压缩后存本地），或附**视频 / 链接**。
- **计分表**：每个项目的进度、是否得分，底部有合计。
- **数据**：右上角「数据」可导出 / 导入 / 清空。⚠️ 数据只存在本浏览器，换设备或清缓存前请先导出备份。

## 调整项目参数

所有项目定义、目标次数（如每周类 26、素食 24 餐、抄经 10 篇、听开示 10 次）都在
[`lib/activities.ts`](lib/activities.ts) 里，直接改数字即可。
计分规则（达标 = 做满 target 次）在 [`lib/scoring.ts`](lib/scoring.ts)。

## 技术栈

Next.js 16（App Router）· React 19 · TypeScript · Tailwind CSS v4 · 纯客户端 + localStorage（无后端）。
