"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-primary py-2 md:py-2"
    >
      <div className="max-w-8xl mx-auto px-2 md:px-0">
        <ol
          className="
            flex items-center 
            gap-1.5 md:gap-2 
            text-xs md:text-sm
            leading-tight 
            overflow-x-auto scrollbar-hide
            whitespace-nowrap
          "
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={index}
                className="
                  flex items-center 
                  gap-1 md:gap-2         /* reduce child spacing */
                  shrink-0
                "
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="
                      text-secondary 
                      hover:text-accent 
                      transition-colors
                      max-w-30 md:max-w-none 
                      truncate"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`
                      ${isLast ? "text-primary font-medium" : "text-secondary"}
                      max-w-30 md:max-w-none 
                      truncate              /* prevent overflow */
                    `}
                  >
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-tertiary" />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
