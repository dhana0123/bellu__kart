import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import CartSidebar from "./cart-sidebar";

export default function FloatingCart() {
  const { itemCount, total, toggleCart, isOpen } = useCart();
  const [showMiniCart, setShowMiniCart] = useState(false);

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={toggleCart}
          className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="icon"
        >
          <ShoppingCart className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full min-w-[1.5rem] h-6 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </Badge>
        </Button>
        
        {/* Total Amount Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-foreground px-3 py-1 rounded-full shadow-md border text-sm font-semibold whitespace-nowrap">
          ₹{total.toFixed(0)}
        </div>
      </div>

      {/* Mini Cart Preview (Optional) */}
      {showMiniCart && itemCount > 0 && (
        <div className="fixed bottom-24 right-4 z-30 bg-white rounded-xl shadow-lg border p-4 min-w-[280px] max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Cart Summary</h3>
            <Button
              onClick={() => setShowMiniCart(false)}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span>{itemCount} items</span>
              <span className="font-semibold">₹{total.toFixed(0)}</span>
            </div>
            <div className="text-xs text-muted-foreground">Free delivery included</div>
          </div>
          
          <Button
            onClick={toggleCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="sm"
          >
            View Cart
          </Button>
        </div>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}