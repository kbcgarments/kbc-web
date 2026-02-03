"use client";

import { ReactNode } from "react";

interface MegaMenuProps {
  isOpen: boolean;
  children: ReactNode;
}

export function MegaMenu({ isOpen, children }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full w-screen bg-primary border-b border-primary shadow-megamenu animate-fadeInDown">
      <div className="max-w-350 mx-auto px-4 lg:px-6 xl:px-8 py-8 lg:py-12">
        {children}
      </div>
    </div>
  );
}
