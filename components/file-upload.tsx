"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink, Link2, Loader2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface FileUploadProps {
  onChange: (fileUrl: string) => void
  value?: string
  className?: string
  showExistingUrl?: boolean
}

export function FileUpload({ onChange, value, className, showExistingUrl = false }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const [fileName, setFileName] = useState<string>("")
  const [isNewFile, setIsNewFile] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [ipfsHash, setIpfsHash] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsNewFile(true)
    setIsUploading(true)

    try {
      // Create a local preview URL for immediate display
      const fileUrl = URL.createObjectURL(file)
      setPreview(fileUrl)

      // Upload to IPFS using our API route
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload to IPFS')
      }

      const data = await response.json()
      
      // Store IPFS hash for display
      setIpfsHash(data.ipfsHash)

      // Use the gateway URL for the product image
      onChange(data.gatewayUrl)
      
      toast({
        title: "Image uploaded to IPFS",
        description: `IPFS Hash: ${data.ipfsHash}`,
      })
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image to IPFS",
        variant: "destructive"
      })
      
      // Keep the local preview but inform the user
      if (preview) {
        onChange(preview) // Fallback to local preview URL
      }
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setPreview(null)
    setFileName("")
    setIsNewFile(false)
    setIpfsHash("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Extract IPFS hash from URL for display
  const getIpfsHash = (url: string) => {
    if (!url) return ""
    
    // Handle ipfs:// protocol URLs
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', '')
    }
    
    // Handle gateway URLs
    if (url.includes('/ipfs/')) {
      return url.split('/ipfs/').pop() || ""
    }
    
    // Return the stored IPFS hash if available
    return ipfsHash || "Unknown"
  }

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
            <p className="text-xs text-muted-foreground truncate">
              {isUploading ? "Uploading to IPFS..." : `File: ${fileName}`}
            </p>
          )}

          {preview && (
            <>
              <div className="relative h-40 w-full border rounded-md overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Product preview" fill className="object-contain" />
              </div>

              {(showExistingUrl || ipfsHash) && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">IPFS URL</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-background p-2 rounded border overflow-x-auto">
                      <code className="text-xs">
                        ipfs://{getIpfsHash(value || '')}
                      </code>
                      {value && (
                        <Button variant="ghost" size="icon" className="h-5 w-5 flex-shrink-0" asChild>
                          <a 
                            href={value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="sr-only">View on IPFS</span>
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Gateway URL:</span>
                      <code className="text-xs bg-background p-1 rounded">
                        {value || `coral-chemical-peacock-81.mypinata.cloud/${getIpfsHash(value || '')}`}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground">
            {isUploading 
              ? "Uploading image to IPFS. This may take a moment..."
              : isNewFile && ipfsHash
                ? "Image uploaded to IPFS. The URL will be stored on the blockchain."
                : "Image will be uploaded to IPFS and the URL will be stored on the blockchain."}
          </p>
        </div>
      </div>
    </div>
  )
}
