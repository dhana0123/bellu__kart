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
  { id: "health", label: "Health & Medicine" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "fitness", label: "Fitness & Sports" },
  { id: "nutrition", label: "Nutrition & Supplements" },
  { id: "home", label: "Home & Garden" },
  { id: "baby", label: "Baby & Kids" },
  { id: "pets", label: "Pet Care" },
  { id: "books", label: "Books & Stationery" },
  { id: "grocery", label: "Grocery & Food" },
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
