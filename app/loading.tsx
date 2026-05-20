export default function Loading() {
  return (
    <div className="container-wide py-16">
      <div className="space-y-4">
        <div className="h-8 w-1/3 rounded-lg bg-muted/60 animate-pulse" />
        <div className="h-4 w-2/3 rounded-lg bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
