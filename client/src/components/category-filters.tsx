import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface CategoryFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Category display labels mapping
const categoryLabels: Record<string, string> = {
  wellness: "Wellness",
  skincare: "Skincare", 
  electronics: "Electronics",
  health: "Health & Medicine",
  beauty: "Beauty & Personal Care",
  fitness: "Fitness & Sports",
  nutrition: "Nutrition & Supplements",
  home: "Home & Garden",
  baby: "Baby & Kids",
  pets: "Pet Care",
  books: "Books & Stationery",
  grocery: "Grocery & Food"
};

export default function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  // Fetch available categories from API
  const { data: availableCategories = [], isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json()) as Promise<string[]>
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex-shrink-0 w-20 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="flex-shrink-0 w-24 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="flex-shrink-0 w-28 h-8 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </section>
    );
  }

  // Build category list with "All" first, then available categories
  const categories = [
    { id: "all", label: "All Products" },
    ...availableCategories.map(cat => ({
      id: cat,
      label: categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

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
