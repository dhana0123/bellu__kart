import { useState } from "react";
import { MapPin, Search, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onAddressChange: (address: string) => void;
}

const popularLocations = [
  { name: "HSR Layout", area: "Bangalore", time: "8-10 mins" },
  { name: "Koramangala", area: "Bangalore", time: "10-12 mins" },
  { name: "Indiranagar", area: "Bangalore", time: "12-15 mins" },
  { name: "Whitefield", area: "Bangalore", time: "15-18 mins" },
  { name: "Electronic City", area: "Bangalore", time: "18-20 mins" },
  { name: "Marathahalli", area: "Bangalore", time: "15-17 mins" },
];

export default function LocationModal({ isOpen, onClose, currentAddress, onAddressChange }: LocationModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (location: string) => {
    onAddressChange(location);
    toast({
      title: "Location updated!",
      description: `Delivery location set to ${location}`,
    });
    onClose();
  };

  const handleCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode the coordinates
          // For now, we'll simulate setting a detected location
          const detectedLocation = "Current Location, Bangalore";
          handleLocationSelect(detectedLocation);
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          toast({
            title: "Location access denied",
            description: "Please enable location access or enter address manually",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: "Location not supported",
        description: "Please enter your address manually",
        variant: "destructive",
      });
    }
  };

  const handleCustomAddressSubmit = () => {
    if (customAddress.trim()) {
      handleLocationSelect(customAddress.trim());
      setCustomAddress("");
    }
  };

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Change Delivery Location</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Location Button */}
          <Button
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>{isLocating ? "Detecting location..." : "Use current location"}</span>
          </Button>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for your area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Popular Locations</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <Card
                  key={index}
                  className="p-3 cursor-pointer hover:bg-accent border border-gray-100 hover:border-primary/30 transition-colors"
                  onClick={() => handleLocationSelect(`${location.name}, ${location.area}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-foreground">{location.name}</div>
                      <div className="text-xs text-muted-foreground">{location.area}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      ⚡ {location.time}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Manual Address Input */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Enter Address Manually</h3>
            <div className="space-y-3">
              <Input
                placeholder="Enter your complete address..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCustomAddressSubmit()}
              />
              <Button
                onClick={handleCustomAddressSubmit}
                disabled={!customAddress.trim()}
                variant="outline"
                className="w-full"
              >
                Set This Address
              </Button>
            </div>
          </div>

          {/* Current Address */}
          {currentAddress && (
            <div className="bg-accent rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Current delivery location:</div>
              <div className="text-sm font-medium text-foreground">{currentAddress}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}