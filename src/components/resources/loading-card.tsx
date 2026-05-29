export function LoadingCard() {
  return (
    <div className="glass-panel animate-pulse rounded-[30px] p-6">
      <div className="h-6 w-24 rounded-full bg-white/8" />
      <div className="mt-5 h-7 w-2/3 rounded-full bg-white/8" />
      <div className="mt-4 space-y-3">
        <div className="h-4 rounded-full bg-white/8" />
        <div className="h-4 rounded-full bg-white/8" />
        <div className="h-4 w-5/6 rounded-full bg-white/8" />
      </div>
      <div className="mt-8 h-12 w-40 rounded-full bg-white/8" />
    </div>
  );
}
