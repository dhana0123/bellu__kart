import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Plus, Minus, Clock, Star, Shield, Truck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import FloatingCart from "@/components/floating-cart";
import type { Product } from "@shared/schema";

// Product Image Gallery Component
function ProductImageGallery({ images, alt, badge }: { images: string[], alt: string, badge?: string }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'new': return 'bg-blue-500 text-white';
      case 'trending': return 'bg-orange-500 text-white';
      case 'bestseller': return 'bg-purple-500 text-white';
      case 'low stock': return 'bg-red-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') setIsZoomed(false);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <img
            src={images[currentImage]}
            alt={alt}
            className="w-full h-96 object-cover rounded-xl shadow-lg cursor-zoom-in transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => setIsZoomed(true)}
            onError={(e) => {
              // Fallback to first image if current image fails to load
              if (currentImage > 0) {
                setCurrentImage(0);
              }
            }}
          />
          {badge && (
            <Badge className={`absolute top-4 left-4 z-10 ${getBadgeVariant(badge)}`}>
              {badge}
            </Badge>
          )}
          
          {/* Zoom Icon */}
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={nextImage}
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {currentImage + 1} / {images.length}
            </div>
          )}

          {/* Image Indicators */}
          {images.length > 1 && images.length <= 5 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                    index === currentImage ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  index === currentImage 
                    ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                onClick={() => setCurrentImage(index)}
              >
                <img
                  src={image}
                  alt={`${alt} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg transition-all ${
                    index === currentImage 
                      ? 'opacity-100' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onError={(e) => {
                    // Hide broken thumbnail images
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                {index === currentImage && (
                  <div className="absolute inset-0 bg-primary/20 rounded-lg"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
          onKeyDown={handleKeyPress}
          tabIndex={0}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={images[currentImage]}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Close Button */}
            <Button
              onClick={() => setIsZoomed(false)}
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation in fullscreen */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={prevImage}
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextImage}
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image counter in fullscreen */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded">
              {currentImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      deliveryTime: product.deliveryTime,
    }, quantity);
    
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart`,
    });
  };

  const getBadgeVariant = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "NEW":
        return "bg-blue-100 text-blue-600";
      case "TRENDING":
        return "bg-pink-100 text-pink-600";
      case "BESTSELLER":
        return "bg-purple-100 text-purple-600";
      case "LOW STOCK":
        return "bg-red-100 text-red-600";
      default:
        if (badge.includes("%")) return "bg-orange-100 text-orange-600";
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStockStatus = () => {
    if (!product.inStock) {
      return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", message: "✗ Out of stock" };
    }
    if (product.stock <= 5) {
      return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", message: `⚠ Only ${product.stock} left` };
    }
    return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", message: "✓ In stock" };
  };

  const stockStatus = getStockStatus();
  const discountAmount = product.originalPrice ? 
    (parseFloat(product.originalPrice) - parseFloat(product.price)).toFixed(0) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image Gallery */}
          <ProductImageGallery 
            images={product.images && product.images.length > 0 ? product.images : [product.image]} 
            alt={product.name}
            badge={product.badges && product.badges.length > 0 ? product.badges[0] : undefined}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-[hsl(var(--trust))]/10 text-[hsl(var(--trust))]">
                  <Clock className="w-3 h-3 mr-1" />
                  ⚡ {product.deliveryTime} mins
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
              
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                    <Badge className="bg-green-100 text-green-700">
                      Save ₹{discountAmount}
                    </Badge>
                  </>
                )}
              </div>

              <div className={`${stockStatus.bg} border ${stockStatus.border} rounded-lg px-3 py-2 mb-6`}>
                <span className={`text-sm ${stockStatus.text} font-medium`}>
                  {stockStatus.message}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Quantity</label>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold text-foreground w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    onClick={() => setQuantity(quantity + 1)}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold disabled:opacity-50"
              >
                Add to Cart - ₹{(parseFloat(product.price) * quantity).toFixed(0)}
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="w-10 h-10 bg-[hsl(var(--trust))]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-[hsl(var(--trust))]" />
                </div>
                <p className="text-xs text-muted-foreground">Free Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">100% Authentic</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>
                    Experience the premium quality of {product.name} from {product.brand}. 
                    This carefully crafted product is designed to meet your daily wellness needs 
                    with the highest standards of quality and effectiveness.
                  </p>
                  <p>
                    Perfect for those who value authenticity and results, this product delivers 
                    on its promises with clinically proven ingredients and formulations.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>100% authentic and verified</li>
                    <li>Fast-acting formula</li>
                    <li>Suitable for daily use</li>
                    <li>Dermatologically tested</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Key Ingredients</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Made with premium ingredients sourced from trusted suppliers:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Active Ingredients:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Natural extracts</li>
                        <li>Essential vitamins</li>
                        <li>Mineral complexes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Enhanced effectiveness</li>
                        <li>Better absorption</li>
                        <li>Long-lasting results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(4.8/5 from 127 reviews)</span>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Verified Buyer</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "Excellent product quality and super fast delivery! Will definitely order again."
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Verified Buyer</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      "Good product, delivered exactly as promised in 10 minutes. Amazing service!"
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Floating Cart */}
      <FloatingCart />
    </div>
  );
}