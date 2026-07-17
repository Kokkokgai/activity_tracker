// 排行榜加载骨架：让点击后立刻跳转，内容再流式填入（避免"按了没反应"）
export default function LoadingLeaderboard() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink">
          排行榜
        </h1>
        <div className="mt-2 h-3 w-64 animate-pulse rounded bg-surface-2" />
      </div>

      <ul className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <li
            key={i}
            className="flex animate-pulse items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <div className="h-5 w-5 shrink-0 rounded-full bg-surface-2" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-24 rounded bg-surface-2" />
              <div className="h-2.5 w-32 rounded bg-surface-2" />
            </div>
            <div className="h-7 w-10 shrink-0 rounded bg-surface-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
