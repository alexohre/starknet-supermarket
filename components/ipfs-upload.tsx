"use client"

import React, { useState, useRef, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink, Link2, Loader2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Define the ref type for external access
export interface IPFSUploadRef {
  uploadToIPFS: () => Promise<string>;
  hasFile: () => boolean;
}

interface IPFSUploadProps {
  onChange: (fileUrl: string) => void;
  value?: string;
  className?: string;
  showIPFSInfo?: boolean;
}

export const IPFSUpload = forwardRef<IPFSUploadRef, IPFSUploadProps>(
  ({ onChange, value, className, showIPFSInfo = false }, ref) => {
    const [preview, setPreview] = useState<string | null>(value || null);
    const [fileName, setFileName] = useState<string>("");
    const [isNewFile, setIsNewFile] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [ipfsHash, setIpfsHash] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      uploadToIPFS: async () => {
        if (!selectedFile) {
          // If there's no new file but we have a valid IPFS URL already, return it
          if (value && !value.startsWith('blob:')) {
            return value;
          }
          throw new Error('No file selected for upload');
        }

        setIsUploading(true);
        try {
          // Create form data for upload
          const formData = new FormData();
          formData.append('file', selectedFile);

          // Send to our API endpoint
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload to IPFS');
          }

          const data = await response.json();
          
          // Store IPFS hash and update UI
          setIpfsHash(data.ipfsHash);
          
          // Update the preview with the gateway URL
          setPreview(data.gatewayUrl);
          
          // Return the gateway URL for the product image
          toast({
            title: "Image uploaded to IPFS",
            description: `Hash: ${data.ipfsHash.substring(0, 10)}...`,
          });
          
          return data.gatewayUrl;
        } catch (error) {
          console.error('Error uploading to IPFS:', error);
          toast({
            title: "Upload failed",
            description: error instanceof Error ? error.message : "Failed to upload image to IPFS",
            variant: "destructive"
          });
          throw error;
        } finally {
          setIsUploading(false);
        }
      },
      hasFile: () => !!selectedFile || (!!value && !value.startsWith('blob:'))
    }));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Store the file for later upload
      setSelectedFile(file);
      setFileName(file.name);
      setIsNewFile(true);
      setIpfsHash(""); // Clear previous hash

      // Create a local preview URL for immediate display
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      
      // Pass the local preview URL temporarily
      onChange(fileUrl);
    };

    const clearFile = () => {
      setPreview(null);
      setFileName("");
      setIsNewFile(false);
      setIpfsHash("");
      setSelectedFile(null);
      onChange("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    // Extract IPFS hash from URL for display
    const getIpfsHash = (url: string) => {
      if (!url) return "";
      
      // Handle ipfs:// protocol URLs
      if (url.startsWith('ipfs://')) {
        return url.replace('ipfs://', '');
      }
      
      // Handle gateway URLs
      if (url.includes('/ipfs/')) {
        return url.split('/ipfs/').pop() || "";
      }
      
      // Return the stored IPFS hash if available
      return ipfsHash || "";
    };

    return (
      <div className={className}>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="product-image">Product Image</Label>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()} 
                className="w-full"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading to IPFS...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {preview ? "Change Image" : "Upload Image"}
                  </>
                )}
              </Button>

              {preview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="h-9 w-9 text-destructive"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {fileName && isNewFile && (
              <div className="text-xs text-muted-foreground">
                <p className="truncate">
                  {isUploading ? "Uploading to IPFS..." : `File selected: ${fileName}`}
                </p>
                {ipfsHash && !isUploading && (
                  <p className="mt-1 flex items-center gap-1">
                    <span className="font-medium">IPFS:</span>
                    <code className="text-xs bg-background p-1 rounded truncate max-w-[200px] inline-block">
                      ipfs://{ipfsHash}
                    </code>
                  </p>
                )}
              </div>
            )}

            {preview && (
              <>
                <div className="relative h-40 w-full border rounded-md overflow-hidden">
                  <Image 
                    src={preview} 
                    alt="Product preview" 
                    fill 
                    className="object-contain"
                    onError={() => {
                      // If image fails to load, show a placeholder
                      setPreview("/placeholder.svg");
                    }}
                  />
                </div>

                {(showIPFSInfo || ipfsHash) && !value?.startsWith('blob:') && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-2">
                      {ipfsHash && (
                        <>
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">IPFS Hash</span>
                          </div>
                          <code className="text-xs bg-background p-1 rounded block overflow-hidden text-ellipsis">
                            {ipfsHash}
                          </code>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            <p className="text-xs text-muted-foreground">
              {isUploading 
                ? "Uploading image to IPFS. This may take a moment..."
                : isNewFile && selectedFile
                  ? "Image will be uploaded to IPFS when you submit the form."
                  : "Select an image to upload to IPFS when you submit the form."}
            </p>
          </div>
        </div>
      </div>
    );
  }
);

IPFSUpload.displayName = "IPFSUpload";
