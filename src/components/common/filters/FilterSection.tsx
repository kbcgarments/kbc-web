"use client";

import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children }: Props) {
  return (
    <section className="py-6 border-b border-primary">
      <h4 className="text-xs uppercase font-bold tracking-wider text-primary mb-4">
        {title}
      </h4>
      {children}
    </section>
  );
}
