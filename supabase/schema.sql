-- 同步同路 · 半年计划 —— 数据库结构
-- 在 Supabase 后台 → SQL Editor 里粘贴运行一次。

-- ============ players：参与者名单（登录下拉用，公开可读）============
create table if not exists public.players (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null,
  email      text not null,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

alter table public.players enable row level security;

-- 登录页需要在未登录状态读取名单（只暴露名字与内部邮箱，没有敏感信息）
drop policy if exists "players readable by all" on public.players;
create policy "players readable by all"
  on public.players for select
  using (true);
-- 写入只允许 service_role（seed 脚本，绕过 RLS），普通用户无写权限。

-- ============ logs：每个人的打卡记录 ============
create table if not exists public.logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  activity_id int  not null,           -- 对应 lib/activities.ts 里的项目 id (1..20)
  logged_on   date not null,           -- 这次记录归属的日期
  note        text,
  photo       text,                    -- 压缩后的图片 data URL（base64）
  video_url   text,
  created_at  timestamptz not null default now()  -- 真实创建时间（排行榜同分时比先后）
);

alter table public.logs enable row level security;

-- 每个人只能看/写/删自己的记录
drop policy if exists "own logs select" on public.logs;
create policy "own logs select"
  on public.logs for select using (auth.uid() = user_id);

drop policy if exists "own logs insert" on public.logs;
create policy "own logs insert"
  on public.logs for insert with check (auth.uid() = user_id);

drop policy if exists "own logs delete" on public.logs;
create policy "own logs delete"
  on public.logs for delete using (auth.uid() = user_id);

create index if not exists logs_user_activity_idx
  on public.logs (user_id, activity_id, created_at);
