"use client";

import { useMemo, useState } from "react";
import { useGetCategories, useDeleteCategory } from "@/hooks";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Loader } from "lucide-react";

export function CategoriesListClient() {
  const { data, isLoading } = useGetCategories();
  const deleteCategory = useDeleteCategory();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);
  const sortedCategories = useMemo(() => {
    return categories.sort((a, b) => a.name_en.localeCompare(b.name_en));
  }, [categories]);
  const filteredCategories = sortedCategories.filter((category) =>
    category.name_en.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCategory.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Categories
          </h1>
          <p className="text-secondary">
            Organize your products into categories
          </p>
        </div>
        <Link
          href="/admin/categories/create"
          className="flex items-center gap-2 px-4 py-2 text-accent rounded-lg hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Category</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-secondary border border-primary rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-primary border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-secondary">
            No categories found
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-secondary border border-primary rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-start justify-start">
                  <span className="text-2xl font-bold text-accent">
                    {category.name_en.charAt(0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/categories/${category.id}/edit`}
                    className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    title="Delete Category Button"
                    onClick={() => handleDelete(category.id, category.name_en)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-primary mb-2">
                {category.name_en}
              </h3>

              {category.description_en && (
                <p className="text-sm text-secondary line-clamp-2 mb-4">
                  {category.description_en}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-primary">
                <span className="text-sm text-secondary">
                  Slug: {category.slug}
                </span>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-sm text-accent hover:text-accent-dark transition-colors"
                >
                  View →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-secondary">
        Showing {filteredCategories.length} of {categories.length} categories
      </div>
    </div>
  );
}
