"use client";

import { useState } from "react";
import { Search, X, Clock, Trash2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useDeleteSearchHistory,
  useSearchProducts,
  useSearchHistory,
  useLockBodyScroll,
} from "@/hooks";
import Image from "next/image";
import { localizeField } from "@/utils";
import { useLanguageStore } from "@/stores";
import { Input } from "@/components/ui/Input";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  useLockBodyScroll(true);

  const router = useRouter();
  const { language, translate } = useLanguageStore();

  /** what user is typing */
  const [query, setQuery] = useState("");

  /** what we are actively searching */
  const [activeQuery, setActiveQuery] = useState("");

  /** forces refetch even if query is the same */
  const [searchNonce, setSearchNonce] = useState(0);

  const { data: results = [], isLoading } = useSearchProducts(
    activeQuery,
    searchNonce,
  );
  const { data: history = [] } = useSearchHistory();
  const deleteHistory = useDeleteSearchHistory();

  const showHistory = query.trim().length < 2;

  /* ================================
     Actions
  ================================= */

  const triggerSearch = (value?: string) => {
    const q = (value ?? query).trim();
    if (q.length < 2) return;

    setActiveQuery(q);
    setSearchNonce((n) => n + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const handleProductClick = (categorySlug: string) => {
    router.push(`/collections/${categorySlug}`);
    onClose();
  };

  const handleDeleteHistory = (id: string) => {
    deleteHistory.mutate(id);
  };

  /* ================================
     Render
  ================================= */

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-3xl mx-4">
        <div className="bg-primary rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary">
                {translate("search.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                title={translate("search.closeSearch")}
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Input
                icon={Search}
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={translate("search.placeholder")}
              />

              {query.trim().length >= 2 && (
                <button
                  onClick={() => triggerSearch()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent/10 rounded-lg transition-colors"
                  title={translate("search.searchButton")}
                >
                  <Search className="w-4 h-4 text-accent" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* HISTORY */}
            {showHistory && history.length > 0 && (
              <div className="px-6 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                  {translate("search.recentSearches")}
                </p>
                <div className="space-y-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors group"
                    >
                      <button
                        onClick={() => {
                          setQuery(item.query);
                          triggerSearch(item.query);
                        }}
                        className="flex items-center gap-3 text-sm flex-1 text-left"
                      >
                        <Clock
                          className="w-4 h-4 text-tertiary"
                          strokeWidth={1.5}
                        />
                        <span className="text-primary">{item.query}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteHistory(item.id)}
                        className="p-1.5 text-tertiary hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        title={translate("search.removeFromHistory")}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RESULTS */}
            {!showHistory && (
              <div className="px-6 pb-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                      {results.length}{" "}
                      {results.length === 1
                        ? translate("search.results.one")
                        : translate("search.results.other")}
                    </p>

                    <div className="space-y-1">
                      {results.map((product) => (
                        <button
                          key={product.id}
                          onClick={() =>
                            product.category?.slug &&
                            handleProductClick(product.category.slug)
                          }
                          className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-lg hover:bg-secondary/30 transition-all group text-left"
                        >
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0].url}
                                alt={localizeField(product, "title", language)}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold truncate">
                                {localizeField(product, "title", language)}
                              </h3>
                              <p className="text-xs text-secondary line-clamp-1">
                                {localizeField(
                                  product,
                                  "description",
                                  language,
                                )}
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            className="w-5 h-5 text-tertiary group-hover:text-accent group-hover:translate-x-1 transition-all"
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-accent mx-auto mb-3" />
                    <p className="text-sm font-semibold">
                      {translate("search.noResults.title")}
                    </p>
                    <p className="text-xs text-secondary">
                      {translate("search.noResults.description")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
