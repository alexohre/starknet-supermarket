"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink, Link2 } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsNewFile(true)

    // Create a local preview URL
    const fileUrl = URL.createObjectURL(file)
    setPreview(fileUrl)

    // In a real app, you would upload to IPFS here and get back a URL
    // For now, we'll just simulate this by passing the local preview URL
    onChange(fileUrl)

    // Note: In a real app with IPFS, you would do something like:
    // const ipfsUrl = await uploadToIPFS(file)
    // onChange(ipfsUrl)
  }

  const clearFile = () => {
    setPreview(null)
    setFileName("")
    setIsNewFile(false)
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Extract IPFS hash from URL for display (simulated)
  const getIpfsHash = (url: string) => {
    // In a real app, you would extract the actual IPFS hash
    // For now, we'll just simulate with a fake hash
    if (!url) return ""
    if (url.includes("ipfs")) {
      return url.split("/").pop() || "QmHash..."
    }
    return "QmHash..." + Math.random().toString(16).slice(2, 6)
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
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {preview ? "Change Image" : "Upload Image"}
            </Button>

            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="h-9 w-9 text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {fileName && isNewFile && <p className="text-xs text-muted-foreground truncate">New file: {fileName}</p>}

          {preview && (
            <>
              <div className="relative h-40 w-full border rounded-md overflow-hidden">
                <Image src={preview || "/placeholder.svg"} alt="Product preview" fill className="object-contain" />
              </div>

              {showExistingUrl && !isNewFile && value && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">IPFS URL</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-background p-2 rounded border overflow-x-auto">
                      <code className="text-xs">ipfs://{getIpfsHash(value)}</code>
                      <Button variant="ghost" size="icon" className="h-5 w-5 flex-shrink-0" asChild>
                        <a href={value} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">View on IPFS</span>
                        </a>
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Gateway URL:</span>
                      <code className="text-xs bg-background p-1 rounded">
                        https://ipfs.io/ipfs/{getIpfsHash(value)}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground">
            {isNewFile
              ? "New image will be uploaded to IPFS and the URL will be stored on the blockchain."
              : "Image is stored on IPFS with the URL stored on the blockchain."}
          </p>
        </div>
      </div>
    </div>
  )
}
