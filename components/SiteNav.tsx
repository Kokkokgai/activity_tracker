"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DataMenu } from "./DataMenu";

const links = [
  { href: "/", label: "主页" },
  { href: "/scoreboard", label: "计分表" },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icon/logo.png"
            alt="同步同路 logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-kai text-[22px] leading-none tracking-wide text-ink">
            同步同路
          </span>
        </Link>

        <nav className="flex items-center gap-1 self-stretch">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center border-b-2 px-3 text-sm font-bold transition-colors ${active
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
          <DataMenu />
        </div>
      </div>
    </header>
  );
}
