import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", label: "All Products" },
  { id: "wellness", label: "Wellness" },
  { id: "skincare", label: "Skincare" },
  { id: "electronics", label: "Electronics" },
];

export default function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <section className="mb-8">
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            variant={selectedCategory === category.id ? "default" : "secondary"}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-accent hover:bg-gray-100 text-foreground"
            }`}
          >
            {category.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
