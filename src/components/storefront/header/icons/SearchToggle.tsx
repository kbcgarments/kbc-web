"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { cn } from "@/utils";
import { SearchOverlay } from "../../search/SearchOverlay";

interface SearchToggleProps {
  isTransparent?: boolean;
}

export function SearchToggle({ isTransparent = false }: SearchToggleProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { translate } = useLanguageStore();
  const iconColorClass = isTransparent ? "text-white" : "text-primary";

  return (
    <>
      <button
        title={translate("common.search")}
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-secondary/50 rounded-md transition-all duration-200 group"
        aria-label={translate("common.search")}
      >
        <Search
          className={cn(
            "w-5 h-5 transition-colors duration-200 group-hover:text-accent",
            iconColorClass,
          )}
        />
      </button>

      {isOpen && <SearchOverlay onClose={() => setIsOpen(false)} />}
    </>
  );
}
