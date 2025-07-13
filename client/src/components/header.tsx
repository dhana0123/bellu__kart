import { useState } from "react";
import { ShoppingCart, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "@/hooks/use-location";
import LocationModal from "./location-modal";
import NavbarPincodeChecker from "./navbar-pincode-checker";
import { Link } from "wouter";

export default function Header() {
  const { itemCount, toggleCart } = useCart();
  const { address, estimatedTime, setAddress } = useLocation();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Bellu</h1>
                <p className="text-xs text-muted-foreground">10-min delivery</p>
              </div>
            </div>

            {/* Location & Delivery Time - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-4">
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center space-x-2 bg-accent rounded-lg px-3 py-2 hover:bg-accent/80 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 bg-[hsl(var(--trust))] rounded-full delivery-pulse"></div>
                <span className="text-sm font-medium text-foreground">Delivering to</span>
                <span className="text-sm font-semibold text-primary">{address.split(',')[0]}</span>
                <MapPin className="w-4 h-4 text-muted-foreground ml-1" />
              </button>
              <div className="bg-[hsl(var(--trust))]/10 text-[hsl(var(--trust))] px-3 py-2 rounded-lg">
                <span className="text-sm font-semibold">⚡ {estimatedTime}</span>
              </div>
            </div>

            {/* Pincode Checker, Admin & Cart */}
            <div className="flex items-center space-x-3">
              <NavbarPincodeChecker />
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="icon"
                  className="p-2 rounded-xl border-primary/20 hover:bg-primary/10"
                >
                  <Shield className="w-5 h-5 text-primary" />
                </Button>
              </Link>
              <Button
                onClick={toggleCart}
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-xl"
                size="icon"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Location Bar */}
        <button 
          onClick={() => setIsLocationModalOpen(true)}
          className="sm:hidden bg-accent border-t border-gray-100 px-4 py-3 w-full hover:bg-accent/80 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[hsl(var(--trust))] rounded-full delivery-pulse"></div>
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Delivering to</span>
              <span className="text-sm font-semibold text-primary">{address}</span>
            </div>
            <div className="bg-[hsl(var(--trust))]/10 text-[hsl(var(--trust))] px-2 py-1 rounded text-xs font-semibold">
              ⚡ {estimatedTime}
            </div>
          </div>
        </button>
      </header>
      
      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={address}
        onAddressChange={setAddress}
      />
    </>
  );
}
