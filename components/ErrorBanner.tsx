"use client";

import { useStore } from "@/lib/store";

export function ErrorBanner() {
  const { error } = useStore();
  if (!error) return null;
  return (
    <div className="border-b border-danger/40 bg-danger/10">
      <div className="mx-auto flex w-full max-w-5xl items-start gap-3 px-4 py-2.5 text-sm text-danger sm:px-6">
        <span aria-hidden>⚠️</span>
        <p className="flex-1">{error}</p>
      </div>
    </div>
  );
}
