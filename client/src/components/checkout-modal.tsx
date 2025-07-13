import { useState } from "react";
import { X, MapPin, CreditCard, Smartphone, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart, type CartItem } from "@/hooks/use-cart";
import { useLocation } from "@/hooks/use-location";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: CartItem[];
}

export default function CheckoutModal({ isOpen, onClose, total, items }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const { sessionId, clearCart } = useCart();
  const { address, estimatedTime } = useLocation();
  const { toast } = useToast();

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("/api/orders", "POST", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order placed successfully!",
        description: "Your order will be delivered in 10 minutes",
      });
      clearCart();
      onClose();
    },
    onError: () => {
      toast({
        title: "Failed to place order",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    const orderData = {
      sessionId,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product?.price,
        name: item.product?.name,
      })),
      total: total.toString(),
      paymentMethod,
      deliveryAddress: {
        name: "John Doe",
        address: address,
        phone: "+91 98765 43210",
      },
      estimatedDelivery: estimatedTime,
    };

    placeOrderMutation.mutate(orderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-end sm:items-center justify-center p-4">
      <Card className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-md max-h-screen overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">Checkout</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Delivery Address */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Delivery Address</h4>
            <Card className="bg-accent border border-gray-200 p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">{address}</p>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span className="text-[hsl(var(--trust))]">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes</span>
                <span>₹0</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3">Payment Method</h4>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <Label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="upi" />
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">UPI Payment</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Instant</span>
                  </div>
                </Label>
                
                <Label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="card" />
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Credit/Debit Card</span>
                </Label>
                
                <Label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="cod" />
                  <Banknote className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">Cash on Delivery</span>
                    <p className="text-xs text-muted-foreground">Pay when you receive</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Place Order Button */}
          <Button
            onClick={handlePlaceOrder}
            disabled={placeOrderMutation.isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl"
          >
            {placeOrderMutation.isPending ? "Placing Order..." : `Place Order - ₹${total.toFixed(0)}`}
          </Button>

          {/* Trust Message */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">🔒 Your payment information is secure and encrypted</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
