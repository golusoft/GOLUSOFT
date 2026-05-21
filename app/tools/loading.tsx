export default function ToolsLoading() {
  return (
    <div className="container-wide py-12">
      <div className="h-10 w-2/3 max-w-md rounded-lg bg-muted/60 animate-pulse" />
      <div className="mt-3 h-4 w-1/2 max-w-sm rounded-lg bg-muted/40 animate-pulse" />
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
