import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Zap, CheckCircle, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/header";
import CategoryFilters from "@/components/category-filters";
import ProductCard from "@/components/product-card";
import FloatingCart from "@/components/floating-cart";
import PincodeChecker from "@/components/pincode-checker";
import type { Product } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: selectedCategory }],
    queryFn: async () => {
      const params = selectedCategory === "all" ? "" : `?category=${selectedCategory}`;
      const response = await fetch(`/api/products${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wellnessProducts = filteredProducts.filter(p => p.category === "wellness").slice(0, 4);
  const skincareProducts = filteredProducts.filter(p => p.category === "skincare").slice(0, 4);
  const electronicsProducts = filteredProducts.filter(p => p.category === "electronics").slice(0, 4);

  const displayProducts = selectedCategory === "all" 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Section */}
        <section className="py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Get essentials in <span className="text-primary">10 minutes</span>
            </h2>
            <p className="text-muted-foreground">Personal care, wellness & daily needs delivered instantly</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search for products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-accent border border-gray-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          {/* Pincode Checker */}
          <PincodeChecker />
        </section>

        {/* Category Filters */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 text-white">
              <h3 className="font-semibold mb-1">⚡ Lightning Deals</h3>
              <p className="text-sm opacity-90">Up to 30% off</p>
              <div className="mt-2">
                <span className="bg-white/20 text-xs px-2 py-1 rounded">Limited time</span>
              </div>
            </Card>
            <Card className="bg-gradient-to-r from-secondary to-green-500 p-4 text-white">
              <h3 className="font-semibold mb-1">🎯 New Arrivals</h3>
              <p className="text-sm opacity-90">Fresh stock in</p>
              <div className="mt-2">
                <span className="bg-white/20 text-xs px-2 py-1 rounded">Just added</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Products Section */}
        {selectedCategory === "all" ? (
          <>
            {/* Wellness Products */}
            {wellnessProducts.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Wellness Essentials</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCategory("wellness")}
                    className="text-primary text-sm font-medium"
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wellnessProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Skincare Products */}
            {skincareProducts.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Skincare Essentials</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCategory("skincare")}
                    className="text-primary text-sm font-medium"
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skincareProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Electronics Products */}
            {electronicsProducts.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Electronics & Accessories</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCategory("electronics")}
                    className="text-primary text-sm font-medium"
                  >
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {electronicsProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* Category-specific products */
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="h-64 bg-gray-100 animate-pulse rounded-xl" />
                ))
              ) : displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Trust Signals */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Why Choose Bellu?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-[hsl(var(--trust))] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Lightning Fast</h4>
                <p className="text-sm text-muted-foreground">Delivery in 10 minutes or less</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Quality Assured</h4>
                <p className="text-sm text-muted-foreground">100% authentic products</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">Multiple payment options</p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Floating Cart */}
      <FloatingCart />
    </div>
  );
}
