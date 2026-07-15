"use client";

import { useState } from "react";
import type { ActivityDef } from "@/lib/types";
import { ScoreboardTable } from "@/components/ScoreboardTable";
import { LogDialog } from "@/components/LogDialog";

export default function ScoreboardPage() {
  const [active, setActive] = useState<ActivityDef | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">计分表</h1>
        <p className="mt-0.5 text-sm text-muted">
          每个项目达标得 1 分，满分 20。点任意一行可记录 / 查看。
        </p>
      </div>

      <ScoreboardTable onOpen={(def) => setActive(def)} />

      <LogDialog activity={active} onClose={() => setActive(null)} />
    </div>
  );
}
