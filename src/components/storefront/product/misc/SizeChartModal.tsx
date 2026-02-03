"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/hooks";
import { useLanguageStore } from "@/stores";
import { cn } from "@/utils";

type Unit = "in" | "cm";

type Row = {
  size: string;
  length: Record<Unit, string>;
  chest: Record<Unit, string>;
};

type Section = {
  title: string;
  rows: Row[];
};

type SizeChart = {
  title: string;
  units: Record<Unit, string>;
  columns: {
    size: string;
    length: string;
    chest: string;
  };
  women: Section;
  men: Section;
};

interface SizeChartModalProps {
  isSizeChartModalOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({
  isSizeChartModalOpen,
  onClose,
}: SizeChartModalProps) {
  useLockBodyScroll(isSizeChartModalOpen);

  const { getObject } = useLanguageStore();
  const [unit, setUnit] = useState<Unit>("in");

  if (!isSizeChartModalOpen) return null;

  const chart = getObject<SizeChart>("product.sizeChart");
  if (!chart) return null;

  const renderMobile = (rows: Row[]) => (
    <div className="grid gap-4 md:hidden">
      {rows.map((row) => (
        <div key={row.size} className="border rounded-lg p-4 bg-secondary/30">
          <p className="font-bold text-lg mb-1">{row.size}</p>
          <p>
            <span className="font-medium">{chart.columns.length}:</span>{" "}
            {row.length[unit]}
          </p>
          <p>
            <span className="font-medium">{chart.columns.chest}:</span>{" "}
            {row.chest[unit]}
          </p>
        </div>
      ))}
    </div>
  );

  const renderTable = (rows: Row[]) => (
    <table className="hidden md:table w-full border-collapse text-sm">
      <thead>
        <tr>
          <th className="border p-2">{chart.columns.size}</th>
          <th className="border p-2">{chart.columns.length}</th>
          <th className="border p-2">{chart.columns.chest}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.size} className="text-center">
            <td className="border p-2 font-semibold">{row.size}</td>
            <td className="border p-2">{row.length[unit]}</td>
            <td className="border p-2">{row.chest[unit]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-secondary w-full max-w-4xl rounded-2xl p-4 md:p-8 shadow-2xl max-h-[85vh] overflow-y-auto animate-scaleIn"
      >
        {/* CLOSE */}
        <button
          title="close modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-primary shadow-md hover:rotate-90 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center mb-6">{chart.title}</h1>

        {/* UNIT TOGGLE */}
        <div className="flex justify-center gap-2 mb-8">
          {(Object.keys(chart.units) as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold border",
                unit === u
                  ? "bg-accent text-white border-accent"
                  : "border-primary/20 text-secondary",
              )}
            >
              {chart.units[u]}
            </button>
          ))}
        </div>

        {/* WOMEN */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{chart.women.title}</h2>
          {renderTable(chart.women.rows)}
          {renderMobile(chart.women.rows)}
        </section>

        {/* MEN */}
        <section>
          <h2 className="text-xl font-bold mb-4">{chart.men.title}</h2>
          {renderTable(chart.men.rows)}
          {renderMobile(chart.men.rows)}
        </section>
      </div>
    </div>
  );
}
