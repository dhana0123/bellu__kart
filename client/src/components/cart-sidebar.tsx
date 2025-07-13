import { X, Minus, Plus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import CheckoutModal from "./checkout-modal";

export default function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, total, itemCount } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const formatPrice = (price: string, quantity: number) => {
    return (parseFloat(price) * quantity).toFixed(0);
  };

  const estimatedDelivery = items.length > 0 
    ? Math.max(...items.map(item => item.product?.deliveryTime || 10))
    : 10;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Your Order</h3>
            <Button
              onClick={toggleCart}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6"></path>
                </svg>
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h4>
              <p className="text-muted-foreground text-sm">Add some products to get started</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground mb-1">
                          {item.product?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.product?.brand}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">
                            ₹{formatPrice(item.product?.price || '0', item.quantity)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              size="icon"
                              variant="outline"
                              className="w-8 h-8"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              size="icon"
                              variant="outline"
                              className="w-8 h-8"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Delivery Info */}
              <Card className="bg-[hsl(var(--trust))]/10 border-[hsl(var(--trust))]/20 p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[hsl(var(--trust))] rounded-full delivery-pulse"></div>
                    <Clock className="w-4 h-4 text-[hsl(var(--trust))]" />
                    <span className="text-sm font-medium text-[hsl(var(--trust))]">
                      Delivery in {estimatedDelivery} minutes
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Free delivery</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">HSR Layout, Bangalore</span>
                </div>
              </Card>

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium">₹{total.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Delivery Fee</span>
                  <span className="text-sm font-medium text-[hsl(var(--trust))]">Free</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Taxes</span>
                  <span className="text-sm font-medium">₹0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">₹{total.toFixed(0)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Including all taxes</p>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl"
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          total={total}
          items={items}
        />
      )}
    </>
  );
}
