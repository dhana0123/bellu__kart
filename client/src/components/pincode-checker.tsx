import { useState } from "react";
import { MapPin, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock data for pincode service areas
const serviceAreas = {
  "560001": { area: "Bangalore Central", deliveryTime: "8-10 mins", available: true },
  "560002": { area: "Bangalore GPO", deliveryTime: "10-12 mins", available: true },
  "560025": { area: "Bangalore City", deliveryTime: "8-10 mins", available: true },
  "560034": { area: "HSR Layout", deliveryTime: "8-10 mins", available: true },
  "560035": { area: "HSR Layout", deliveryTime: "8-10 mins", available: true },
  "560068": { area: "Koramangala", deliveryTime: "10-12 mins", available: true },
  "560076": { area: "Koramangala", deliveryTime: "10-12 mins", available: true },
  "560038": { area: "Indiranagar", deliveryTime: "12-15 mins", available: true },
  "560066": { area: "Whitefield", deliveryTime: "15-18 mins", available: true },
  "560100": { area: "Electronic City", deliveryTime: "18-20 mins", available: true },
  "560037": { area: "Marathahalli", deliveryTime: "15-17 mins", available: true },
  "400001": { area: "Mumbai Fort", deliveryTime: "Coming Soon", available: false },
  "110001": { area: "New Delhi", deliveryTime: "Coming Soon", available: false },
  "600001": { area: "Chennai Central", deliveryTime: "Coming Soon", available: false },
};

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    available: boolean;
    area?: string;
    deliveryTime?: string;
    message?: string;
  } | null>(null);
  const { toast } = useToast();

  const checkPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      toast({
        title: "Invalid pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const serviceInfo = serviceAreas[pincode as keyof typeof serviceAreas];
    
    if (serviceInfo) {
      setResult({
        available: serviceInfo.available,
        area: serviceInfo.area,
        deliveryTime: serviceInfo.deliveryTime,
        message: serviceInfo.available 
          ? `Great news! We deliver to ${serviceInfo.area}` 
          : `We're expanding to ${serviceInfo.area} soon!`
      });
      
      if (serviceInfo.available) {
        toast({
          title: "Delivery Available!",
          description: `10-minute delivery available in ${serviceInfo.area}`,
        });
      }
    } else {
      setResult({
        available: false,
        message: "We don't deliver to this area yet, but we're expanding rapidly!"
      });
    }
    
    setIsChecking(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkPincode();
    }
  };

  const resetCheck = () => {
    setResult(null);
    setPincode("");
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border border-primary/20 p-4">
      {!result ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground">Check delivery availability</p>
            <p className="text-xs text-muted-foreground">Enter your pincode to confirm 10-min delivery</p>
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isChecking ? "Checking..." : "Check"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            {result.available ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-orange-500 mt-0.5" />
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
    </Card>
  );
}