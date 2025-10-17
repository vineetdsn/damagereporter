import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Camera, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { UploadResult } from "@uppy/core";

interface PhotoUploadProps {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
}

export default function PhotoUpload({ photoUrls, onChange }: PhotoUploadProps) {
  const { toast } = useToast();

  const processPhotoMutation = useMutation({
    mutationFn: async (photoURL: string) => {
      const response = await apiRequest("POST", "/api/photos/process", { photoURL });
      return response.json();
    },
    onSuccess: (data) => {
      onChange([...photoUrls, data.objectPath]);
    },
    onError: (error) => {
      toast({
        title: "Photo Upload Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/photos/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      if (uploadedFile.uploadURL) {
        processPhotoMutation.mutate(uploadedFile.uploadURL);
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newUrls = photoUrls.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const validateFileType = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  };

  const validateFileSize = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="text-primary mr-3" />
            Damage Photos
          </div>
          <span className="text-sm font-normal text-muted-foreground" data-testid="text-photo-count">
            {photoUrls.length}/10 uploaded
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload Zone */}
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors mb-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <i className="fas fa-cloud-upload-alt text-3xl text-muted-foreground"></i>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Drag & drop photos here</p>
              <p className="text-xs text-muted-foreground">or click to browse files</p>
            </div>
            <ObjectUploader
              maxNumberOfFiles={10 - photoUrls.length}
              maxFileSize={5 * 1024 * 1024} // 5MB
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-folder-open mr-2"></i>
              Choose Files
            </ObjectUploader>
            <p className="text-xs text-muted-foreground">
              JPG, PNG up to 5MB each • 5-10 images recommended
            </p>
          </div>
        </div>

        {/* Photo Preview Grid */}
        {photoUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photoUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Damage photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-border transition-transform hover:scale-105"
                  data-testid={`img-photo-${index}`}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-0"
                  onClick={() => handleRemovePhoto(index)}
                  data-testid={`button-remove-photo-${index}`}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Photo {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
