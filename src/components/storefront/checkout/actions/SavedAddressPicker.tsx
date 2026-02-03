"use client";

import { useLanguageStore } from "@/stores";
import { CustomerAddress } from "@/types";
import { Star, ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Props {
  addresses: CustomerAddress[];
  selectedId?: string;
  onSelect: (address: CustomerAddress) => void;
}

export default function SavedAddressPickerDropdown({
  addresses,
  selectedId,
  onSelect,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageStore();
  const selectedAddress = addresses.find((addr) => addr.id === selectedId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!addresses.length) return null;

  const handleSelect = (address: CustomerAddress) => {
    onSelect(address);
    setIsOpen(false);
  };

  // Format address in single line
  const formatAddress = (addr: CustomerAddress) => {
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.postalCode,
      addr.country,
    ].filter(Boolean);
    return parts.join(", ");
  };
  const truncate = (str: string, max = 30) =>
    str.length > max ? str.slice(0, max) + "…" : str;
  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 p-4 bg-[#0F0E0E] rounded-lg hover:border-accent/40 transition-all focus:outline-none focus:border-(--color-text-accent) focus:ring-2 focus:ring-(--color-text-accent)/20 text-primary border border-gray-700"
      >
        {selectedAddress ? (
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="font-semibold text-white text-sm shrink-0">
              {selectedAddress.fullName}
            </span>
            {selectedAddress.isDefault && (
              <Star
                className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
                strokeWidth={1.5}
              />
            )}
            <span className="text-gray-400 text-xs shrink-0">•</span>
            <p className="text-xs text-gray-400 truncate">
              {truncate(formatAddress(selectedAddress))}
            </p>
          </div>
        ) : (
          <span className="text-white text-sm">
            {translate("checkout.form.selectAddress")}
          </span>
        )}

        <ChevronDown
          className={`w-5 h-5 text-white transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="p-2 flex flex-col gap-1">
            {addresses.map((addr) => {
              const isSelected = selectedId === addr.id;

              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => handleSelect(addr)}
                  className={`text-left p-3 rounded-lg transition-all
                    ${
                      isSelected
                        ? "bg-accent/10 border border-accent/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Check Indicator */}
                    <div className="shrink-0">
                      <div
                        className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                          ${
                            isSelected
                              ? "border-accent bg-accent text-white"
                              : "border-gray-300 dark:border-gray-600"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>

                    {/* Address Content - Single Line */}
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm shrink-0">
                        {addr.fullName}
                      </p>
                      {addr.isDefault && (
                        <Star
                          className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
                          strokeWidth={1.5}
                        />
                      )}
                      <span className="text-gray-400 dark:text-gray-500 text-xs shrink-0">
                        •
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {formatAddress(addr)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
