"use client";

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
    <header className="sticky top-0 z-40 border-b border-border bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-strong"
          >
            ☸
          </span>
          <span className="font-semibold tracking-tight text-ink">
            同步同路
          </span>
        </Link>

        <nav className="ml-2 flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-soft text-brand-strong"
                    : "text-muted hover:bg-surface-2 hover:text-ink"
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
