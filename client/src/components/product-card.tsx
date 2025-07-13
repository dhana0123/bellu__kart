import { Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      deliveryTime: product.deliveryTime,
    });
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "NEW":
        return "bg-blue-100 text-blue-600";
      case "TRENDING":
        return "bg-pink-100 text-pink-600";
      case "BESTSELLER":
        return "bg-purple-100 text-purple-600";
      case "LOW STOCK":
        return "bg-red-100 text-red-600";
      default:
        if (badge.includes("%")) return "bg-orange-100 text-orange-600";
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStockStatus = () => {
    if (!product.inStock) {
      return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", message: "✗ Out of stock" };
    }
    if (product.stock <= 5) {
      return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", message: `⚠ Only ${product.stock} left` };
    }
    return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", message: "✓ In stock" };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-32 object-cover" 
        />
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-[hsl(var(--trust))]/10 text-[hsl(var(--trust))] text-xs px-2 py-1 rounded-full font-medium">
            <Clock className="w-3 h-3 mr-1" />
            ⚡ {product.deliveryTime} mins
          </Badge>
          {product.badges.length > 0 && (
            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeVariant(product.badges[0])}`}>
              {product.badges[0]}
            </Badge>
          )}
        </div>
        
        <h4 className="font-medium text-sm text-foreground mb-1">{product.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className={`mt-2 ${stockStatus.bg} border ${stockStatus.border} rounded px-2 py-1`}>
          <span className={`text-xs ${stockStatus.text} font-medium`}>
            {stockStatus.message}
          </span>
        </div>
      </div>
    </Card>
  );
}
