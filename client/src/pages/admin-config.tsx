import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Settings, Plus, X } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import type { AppConfig } from "@shared/schema";

interface ConfigItem {
  key: string;
  value: string[] | string;
  description?: string;
}

export default function AdminConfig() {
  const [newCategory, setNewCategory] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['/api/admin/config'],
    queryFn: () => fetch('/api/admin/config').then(res => res.json()) as Promise<AppConfig[]>
  });

  const updateConfigMutation = useMutation({
    mutationFn: (config: ConfigItem) => 
      fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/config'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Configuration updated",
        description: "Settings have been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  });

  const allowedCategoriesConfig = configs.find(c => c.key === 'allowed_categories');
  const allowedPincodesConfig = configs.find(c => c.key === 'allowed_pincodes');

  const allowedCategories = (allowedCategoriesConfig?.value as string[]) || [];
  const allowedPincodes = (allowedPincodesConfig?.value as string[]) || [];

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = [...allowedCategories, newCategory.toLowerCase().trim()];
    updateConfigMutation.mutate({
      key: 'allowed_categories',
      value: updatedCategories,
      description: 'Categories that should be displayed in the frontend'
    });
    setNewCategory("");
  };

  const handleRemoveCategory = (category: string) => {
    const updatedCategories = allowedCategories.filter(c => c !== category);
    updateConfigMutation.mutate({
      key: 'allowed_categories',
      value: updatedCategories,
      description: 'Categories that should be displayed in the frontend'
    });
  };

  const handleAddPincode = () => {
    if (!newPincode.trim() || newPincode.length !== 6) {
      toast({
        title: "Invalid PIN code",
        description: "PIN code must be exactly 6 digits",
        variant: "destructive",
      });
      return;
    }
    
    const updatedPincodes = [...allowedPincodes, newPincode.trim()];
    updateConfigMutation.mutate({
      key: 'allowed_pincodes',
      value: updatedPincodes,
      description: 'PIN codes where delivery is available'
    });
    setNewPincode("");
  };

  const handleRemovePincode = (pincode: string) => {
    const updatedPincodes = allowedPincodes.filter(p => p !== pincode);
    updateConfigMutation.mutate({
      key: 'allowed_pincodes',
      value: updatedPincodes,
      description: 'PIN codes where delivery is available'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">System Configuration</h1>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex space-x-2 mt-2">
              <Link href="/admin">
                <Button variant="outline">
                  Products
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline">
                  Orders
                </Button>
              </Link>
              <Button variant="default" className="bg-primary">
                Configuration
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
        {/* Categories Management */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage which product categories are displayed to customers. Only categories with products will be shown.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter category name (e.g., wellness)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <Button 
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || updateConfigMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allowedCategories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveCategory(category)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {allowedCategories.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No categories configured. Add categories to control which ones are displayed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* PIN Codes Management */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery PIN Codes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage which PIN codes are eligible for delivery. Customers can check if their area is serviceable.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit PIN code"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={(e) => e.key === 'Enter' && handleAddPincode()}
                maxLength={6}
              />
              <Button 
                onClick={handleAddPincode}
                disabled={!newPincode.trim() || newPincode.length !== 6 || updateConfigMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-60 overflow-y-auto">
              {allowedPincodes.map((pincode) => (
                <Badge 
                  key={pincode} 
                  variant="outline" 
                  className="flex items-center justify-between gap-1 px-2 py-1"
                >
                  <span className="text-xs">{pincode}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemovePincode(pincode)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              <strong>{allowedPincodes.length}</strong> PIN codes configured for delivery
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}