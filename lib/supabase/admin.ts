import { createClient } from "@supabase/supabase-js";

// 管理员客户端（service_role 密钥，绕过 RLS）。
// 只能在服务器端使用（排行榜聚合、seed 脚本）——绝不可打包进前端。
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
