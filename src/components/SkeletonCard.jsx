export function SkeletonCard() {
  return (
    <div className="flex flex-col justify-between relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm animate-shimmer">
      <div className="relative aspect-3/4 bg-neutral-800/50"></div>
      <div className="bg-neutral-800/80 py-1.5 px-2 sm:px-3 h-5.5 sm:h-6.5 border-t border-b border-white/5"></div>
      <div className="p-3 sm:p-6 text-center flex flex-col items-center grow justify-between h-25 sm:h-30">
        <div className="w-full flex flex-col items-center space-y-2 mb-4">
          <div className="h-3 w-1/2 bg-neutral-800/80 rounded-sm"></div>
          <div className="h-4 sm:h-5 w-3/4 bg-neutral-800/80 rounded-sm"></div>
        </div>
        <div className="h-4 sm:h-5 w-1/3 bg-neutral-800/80 rounded-sm"></div>
      </div>
    </div>
  );
}
