"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { UserMenu } from "./UserMenu";

const PLAYER_LINKS = [
  { href: "/", label: "主页" },
  { href: "/scoreboard", label: "计分表" },
  { href: "/leaderboard", label: "排行榜" },
];

// 围观者（师父）只看排行榜
const VIEWER_LINKS = [{ href: "/leaderboard", label: "排行榜" }];

export function SiteNav() {
  const pathname = usePathname();
  const { isViewer } = useStore();
  if (pathname === "/login") return null; // 登录页不显示导航

  const links = isViewer ? VIEWER_LINKS : PLAYER_LINKS;
  const home = isViewer ? "/leaderboard" : "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6">
        <Link href={home} className="flex items-center gap-2">
          <Image
            src="/icon/logo.png"
            alt="同步同路 logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-kai hidden text-[22px] leading-none tracking-wide text-ink sm:inline">
            同步同路
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 self-stretch">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center border-b-2 px-2.5 text-sm font-bold transition-colors sm:px-3 ${
                  active
                    ? "border-brand text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
