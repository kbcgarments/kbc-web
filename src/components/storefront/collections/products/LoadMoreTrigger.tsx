// components/common/LoadMoreTrigger.tsx
"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface Props {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function LoadMoreTrigger({ onLoadMore, hasMore, isLoading }: Props) {
  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return <div ref={ref} className="h-1" />;
}
