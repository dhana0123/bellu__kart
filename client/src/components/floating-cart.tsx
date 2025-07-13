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
      {/* Floating Cart Tab */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={toggleCart}
          className="relative bg-[hsl(var(--trust))] hover:bg-[hsl(var(--trust))]/90 text-white rounded-full px-6 py-3 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3"
        >
          <ShoppingCart className="w-5 h-5" />
          <div className="flex flex-col items-start">
            <span className="text-xs opacity-90">{itemCount} items</span>
            <span className="text-sm font-semibold">₹{total.toFixed(0)}</span>
          </div>
          <Badge className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </Badge>
        </Button>
      </div>

      {/* Mini Cart Preview (Optional) */}
      {showMiniCart && itemCount > 0 && (
        <div className="fixed bottom-20 right-4 z-30 bg-white rounded-xl shadow-lg border p-4 min-w-[280px] max-w-sm">
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
            className="w-full bg-[hsl(var(--trust))] hover:bg-[hsl(var(--trust))]/90 text-white"
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