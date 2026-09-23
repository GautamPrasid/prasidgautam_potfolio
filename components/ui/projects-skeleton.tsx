export function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-3xl bg-card border border-border overflow-hidden space-y-4 p-6"
        >
          <div className="w-full aspect-[16/9] rounded-2xl bg-muted" />
          <div className="h-6 w-2/3 rounded-lg bg-muted" />
          <div className="h-4 w-full rounded-lg bg-muted" />
          <div className="h-4 w-4/5 rounded-lg bg-muted" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 rounded-xl bg-muted" />
            <div className="h-6 w-20 rounded-xl bg-muted" />
            <div className="h-6 w-16 rounded-xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
