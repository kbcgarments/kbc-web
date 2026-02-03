"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";

interface NavItemWithMegaMenuProps {
  label: string;
  megaMenuContent: ReactNode;
}

export function NavItemWithMegaMenu({
  label,
  megaMenuContent,
}: NavItemWithMegaMenuProps) {
  const isHome = usePathname() === "/";
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current!);
    timeoutRef.current = setTimeout(() => setIsOpen(true), 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current!);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current!);
  }, []);

  return (
    <div
      className={cn("relative group/nav-item", isHome && "data-[home=true]")}
      data-home={isHome}
      data-open={isOpen}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* LABEL BUTTON */}
      <button className="flex items-center gap-1 text-sm font-medium nav-item-label ">
        {label}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 ",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* MEGA MENU */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full pt-2">
          <div className="relative">{megaMenuContent}</div>
        </div>
      )}
    </div>
  );
}
