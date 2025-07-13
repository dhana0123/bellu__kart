import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadImages, deleteImage } from "@/lib/firebase";
import { convertFilesToBase64 } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image file`,
          variant: "destructive",
        });
      }
      return isValid;
    });

    if (!validFiles.length) return;

    setUploading(true);
    
    try {
      // Try Firebase upload first
      const uploadedUrls = await uploadImages(validFiles);
      onImagesChange([...images, ...uploadedUrls]);
      toast({
        title: "Images uploaded successfully",
        description: `${uploadedUrls.length} image(s) uploaded to Firebase`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      
      // Fallback to base64 if Firebase fails
      try {
        const base64Images = await convertFilesToBase64(validFiles);
        onImagesChange([...images, ...base64Images]);
        toast({
          title: "Images uploaded (fallback mode)",
          description: `${base64Images.length} image(s) uploaded as base64. Note: Configure Firebase Storage rules for cloud storage.`,
          variant: "default",
        });
      } catch (fallbackError) {
        console.error("Fallback upload error:", fallbackError);
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  }, [images, maxImages, onImagesChange, toast]);

  const handleRemoveImage = async (index: number) => {
    setDeletingIndex(index);
    const imageUrl = images[index];
    
    try {
      // Only try to delete from Firebase if it's not a base64 image
      if (!imageUrl.startsWith('data:')) {
        await deleteImage(imageUrl);
      }
      
      // Remove from local state
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast({
        title: "Image removed",
        description: "Image has been deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      
      // Still remove from local state even if Firebase delete fails
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast({
        title: "Image removed",
        description: "Image removed from form (Firebase deletion may have failed)",
      });
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Product Images</label>
        <span className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images
        </span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <Card key={index} className="relative group overflow-hidden">
            <div className="aspect-square">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => handleRemoveImage(index)}
              disabled={deletingIndex === index}
            >
              {deletingIndex === index ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
          </Card>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <label className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
                  <span className="text-xs text-muted-foreground">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    Click to upload images
                  </span>
                </>
              )}
            </label>
          </Card>
        )}
      </div>

      {/* Primary Image Indicator */}
      {images.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <ImageIcon className="inline h-3 w-3 mr-1" />
          First image will be used as the primary product image
        </div>
      )}
    </div>
  );
}