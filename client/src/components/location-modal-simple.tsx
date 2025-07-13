import React, { useState } from "react";
import { Search, Navigation, MapPin } from "lucide-react";
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
  { name: "Jayanagar", area: "Bangalore", time: "12-15 mins" },
  { name: "Rajajinagar", area: "Bangalore", time: "10-12 mins" },
  { name: "Malleshwaram", area: "Bangalore", time: "12-14 mins" },
  { name: "Basavanagudi", area: "Bangalore", time: "14-16 mins" },
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
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          handleLocationSelect(locationString);
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
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
    }
  };

  const handleCustomAddressSubmit = () => {
    if (customAddress.trim()) {
      handleLocationSelect(customAddress);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Select Delivery Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for area, landmark, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Location */}
          <div>
            <Button
              onClick={handleCurrentLocation}
              disabled={isLocating}
              variant="outline"
              className="w-full justify-start"
            >
              {isLocating ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Navigation className="w-4 h-4 mr-2" />
              )}
              {isLocating ? "Getting your location..." : "Use current location"}
            </Button>
          </div>

          {/* Popular Locations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Popular Locations</h3>
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {popularLocations
                .filter(location => 
                  searchQuery === "" || 
                  location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  location.area.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((location, index) => (
                <Card
                  key={index}
                  className="p-3 hover:bg-accent cursor-pointer transition-colors"
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

          {/* Current Address Display */}
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