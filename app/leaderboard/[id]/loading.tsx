// 个人详情加载骨架
export default function LoadingPlayer() {
  return (
    <div className="space-y-4">
      <span className="inline-block text-sm font-medium text-muted">
        ← 返回排行榜
      </span>

      <section className="animate-pulse rounded-2xl border border-border bg-surface px-5 py-5 sm:px-6">
        <div className="h-5 w-28 rounded bg-surface-2" />
        <div className="mt-3 h-9 w-24 rounded bg-surface-2" />
        <div className="mt-3 h-2.5 w-full rounded-full bg-surface-2" />
        <div className="mt-3 h-2.5 w-48 rounded bg-surface-2" />
      </section>

      {Array.from({ length: 3 }).map((_, s) => (
        <section key={s} className="space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-surface-2" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border bg-surface p-4"
            >
              <div className="h-4 w-40 rounded bg-surface-2" />
              <div className="mt-2 h-3 w-full rounded bg-surface-2" />
              <div className="mt-3 h-1.5 w-full rounded-full bg-surface-2" />
              <div className="mt-3 h-3 w-16 rounded bg-surface-2" />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
