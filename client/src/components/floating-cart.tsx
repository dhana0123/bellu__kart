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
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
        <div className="max-w-md mx-auto">
          <Button
            onClick={toggleCart}
            className="relative w-full bg-green-500 hover:bg-green-600 text-white rounded-xl px-6 py-4 h-16 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between"
          >
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6" />
            <div className="flex flex-col items-start">
              <span className="text-sm opacity-90">{itemCount} items</span>
              <span className="text-lg font-semibold">₹{total.toFixed(0)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">View Cart</span>
            <Badge className="bg-orange-500 text-white rounded-full min-w-[1.5rem] h-6 flex items-center justify-center text-sm font-bold">
              {itemCount}
            </Badge>
          </div>
          </Button>
        </div>
      </div>

      {/* Mini Cart Preview (Optional) */}
      {showMiniCart && itemCount > 0 && (
        <div className="fixed bottom-24 left-4 right-4 z-30 bg-white rounded-xl shadow-lg border p-4">
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
            className="w-full bg-green-500 hover:bg-green-600 text-white"
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