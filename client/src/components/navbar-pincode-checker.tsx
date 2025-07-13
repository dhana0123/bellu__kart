import { useState } from "react";
import { Check, MapPin, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface PincodeResult {
  available: boolean;
  area?: string;
  message: string;
  deliveryTime?: string;
}

export default function NavbarPincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mock data for available areas
  const serviceAreas = {
    "560001": { area: "Bangalore Central", deliveryTime: "8-10 mins" },
    "560002": { area: "Bangalore City", deliveryTime: "6-8 mins" },
    "560003": { area: "Malleshwaram", deliveryTime: "8-10 mins" },
    "560004": { area: "Rajajinagar", deliveryTime: "10-12 mins" },
    "560005": { area: "Seshadripuram", deliveryTime: "8-10 mins" },
    "560006": { area: "Chamarajpet", deliveryTime: "10-12 mins" },
    "560007": { area: "Jayanagar 4th Block", deliveryTime: "6-8 mins" },
    "560008": { area: "Girinagar", deliveryTime: "8-10 mins" },
    "560009": { area: "Jayanagar 3rd Block", deliveryTime: "6-8 mins" },
    "560010": { area: "Padmanabhanagar", deliveryTime: "10-12 mins" },
  };

  const checkPincode = async () => {
    if (pincode.length !== 6) return;
    
    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const serviceArea = serviceAreas[pincode as keyof typeof serviceAreas];
    
    if (serviceArea) {
      setResult({
        available: true,
        area: serviceArea.area,
        message: `Great! We deliver to ${serviceArea.area}`,
        deliveryTime: serviceArea.deliveryTime
      });
    } else {
      setResult({
        available: false,
        message: "Sorry, we don't deliver to this area yet",
      });
    }
    
    setIsChecking(false);
  };

  const resetCheck = () => {
    setResult(null);
    setPincode("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPincode();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center space-x-2 bg-accent border-primary/20 hover:bg-primary/5"
        >
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Check Pincode</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        {!result ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground">Check delivery availability</h4>
              <p className="text-sm text-muted-foreground">Enter your pincode to confirm 10-min delivery</p>
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={handleKeyPress}
                className="flex-1"
                maxLength={6}
              />
              <Button 
                onClick={checkPincode}
                disabled={isChecking || pincode.length !== 6}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isChecking ? "..." : "Check"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              {result.available ? (
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{result.message}</p>
                {result.area && (
                  <p className="text-xs text-muted-foreground">Pincode: {pincode} - {result.area}</p>
                )}
              </div>
            </div>
            
            {result.available && result.deliveryTime && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Delivery in {result.deliveryTime}
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Available Now
                </Badge>
              </div>
            )}
            
            {!result.available && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">
                  Coming soon to your area
                </span>
              </div>
            )}
            
            <Button 
              onClick={resetCheck}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Check Another Pincode
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}