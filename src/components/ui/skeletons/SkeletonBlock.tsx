"use client";

export default function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`
        relative overflow-hidden
        bg-sand-200 dark:bg-sand-700 rounded-lg
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-full bg-linear-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
      </div>
    </div>
  );
}
