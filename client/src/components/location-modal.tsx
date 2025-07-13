import { useState, useEffect, useRef } from "react";
import { MapPin, Search, Navigation, X, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Google Maps API type declarations
declare global {
  interface Window {
    google: any;
  }
}

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
  const [showMapView, setShowMapView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleLocationSelect = (location: string) => {
    onAddressChange(location);
    toast({
      title: "Location updated!",
      description: `Delivery location set to ${location}`,
    });
    onClose();
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Fallback to coordinates if no API key is available
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    try {
      // Using Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleCurrentLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const address = await reverseGeocode(latitude, longitude);
            setSelectedLocation({ lat: latitude, lng: longitude, address });
            handleLocationSelect(address);
          } catch (error) {
            handleLocationSelect(`${latitude}, ${longitude}`);
          }
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

  const handleMapClick = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    setSelectedLocation({ lat, lng, address });
    setCustomAddress(address);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    // Clear any existing content in the map container
    mapRef.current.innerHTML = '';

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Add click listener to map
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        handleMapClick(lat, lng);
      });

      // Add marker for selected location
      if (selectedLocation) {
        const marker = new window.google.maps.Marker({
          position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
          map: map,
          draggable: true,
        });

        marker.addListener('dragend', (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          handleMapClick(lat, lng);
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map initialization failed",
        description: "Please try refreshing the page or use search instead.",
        variant: "destructive",
      });
    }
  };

  const hasGoogleMapsKey = () => {
    return !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  };

  useEffect(() => {
    if (showMapView && isOpen && hasGoogleMapsKey()) {
      // Load Google Maps API if not already loaded
      if (!window.google) {
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
          script.onload = initializeMap;
          script.onerror = () => {
            toast({
              title: "Maps unavailable",
              description: "Unable to load Google Maps. Please use search instead.",
              variant: "destructive",
            });
          };
          document.head.appendChild(script);
        }
      } else {
        // Add a small delay to ensure DOM is ready
        setTimeout(initializeMap, 100);
      }
    }
  }, [showMapView, isOpen]);

  // Separate effect for handling selectedLocation updates
  useEffect(() => {
    if (showMapView && isOpen && window.google && selectedLocation) {
      setTimeout(initializeMap, 100);
    }
  }, [selectedLocation]);

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
          {/* View Toggle */}
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowMapView(false)}
              variant={!showMapView ? "default" : "outline"}
              className="flex-1 flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>
            <Button
              onClick={() => setShowMapView(true)}
              variant={showMapView ? "default" : "outline"}
              className="flex-1 flex items-center space-x-2"
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </Button>
          </div>

          {/* Current Location Button */}
          <Button
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-2"
          >
            <Navigation className="w-4 h-4" />
            <span>{isLocating ? "Detecting location..." : "Use current location"}</span>
          </Button>

          {!showMapView ? (
            <>
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
            </>
          ) : (
            /* Google Maps View */
            <div className="space-y-4">
              {hasGoogleMapsKey() ? (
                <>
                  <div className="text-sm text-muted-foreground">
                    Click on the map to select your delivery location, or drag the marker to adjust.
                  </div>
                  
                  {/* Google Maps Container */}
                  <div 
                    ref={mapRef}
                    className="w-full h-80 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center"
                  >
                    {!window.google && (
                      <div className="text-center">
                        <Map className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-sm text-muted-foreground">Loading Google Maps...</div>
                      </div>
                    )}
                  </div>

                  {/* Selected Location Display */}
                  {selectedLocation && (
                    <div className="bg-accent rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Selected location:</div>
                      <div className="text-sm font-medium text-foreground">{selectedLocation.address}</div>
                      <Button
                        onClick={() => handleLocationSelect(selectedLocation.address)}
                        className="mt-2 w-full"
                      >
                        Confirm This Location
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback when Google Maps API key is not available */
                <div className="text-center py-12">
                  <Map className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-lg font-medium text-foreground mb-2">Google Maps Not Available</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Google Maps integration requires an API key. Please use the search tab to find your location.
                  </div>
                  <Button
                    onClick={() => setShowMapView(false)}
                    variant="outline"
                  >
                    Switch to Search
                  </Button>
                </div>
              )}
            </div>
          )}

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