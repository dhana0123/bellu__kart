import { Plus, Minus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, updateQuantity, items } = useCart();

  // Find current item in cart
  const cartItem = items.find(item => item.productId === product.id);
  const quantity = cartItem?.quantity || 0;

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

  const handleIncrement = () => {
    if (quantity === 0) {
      handleAddToCart();
    } else {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
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
      <Link href={`/product/${product.id}`}>
        <div className="relative cursor-pointer">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-32 object-cover" 
          />
        </div>
      </Link>
      
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
        
        <Link href={`/product/${product.id}`}>
          <h4 className="font-medium text-sm text-foreground mb-1 cursor-pointer hover:text-primary">{product.name}</h4>
        </Link>
        <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
            )}
          </div>
          {quantity === 0 ? (
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex items-center space-x-1">
              <Button
                onClick={handleDecrement}
                className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-md transition-colors"
                size="icon"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-sm font-semibold min-w-[24px] text-center">{quantity}</span>
              <Button
                onClick={handleIncrement}
                disabled={!product.inStock}
                className="bg-orange-500 hover:bg-orange-600 text-white p-1 rounded-md transition-colors disabled:opacity-50"
                size="icon"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
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
