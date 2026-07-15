import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 服务器端 Supabase 客户端（读 cookie 里的会话；用于服务器组件 / 路由）
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 在服务器组件里无法写 cookie —— 交给 middleware 刷新会话即可
          }
        },
      },
    },
  );
}
