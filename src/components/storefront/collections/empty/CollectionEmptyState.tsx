"use client";

import { useLanguageStore } from "@/stores";
import { AlertTriangle } from "lucide-react";

export default function CollectionEmptyState() {
  const { translate } = useLanguageStore();
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <AlertTriangle className="w-12 h-12 text-accent mb-4" />
      <h2 className="text-xl font-bold text-primary">
        {translate("collections.empty.title")}
      </h2>
      <p className="text-secondary max-w-xs">
        {translate("collections.empty.description")}
      </p>
    </div>
  );
}
