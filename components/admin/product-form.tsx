"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { IPFSUpload, type IPFSUploadRef } from "@/components/ipfs-upload"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString, type ByteArray, uint256 } from "starknet"
import { strkToMilliunits, formatStrkPriceNatural } from "@/lib/utils"

export function AdminProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  })
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [successfulSubmission, setSuccessfulSubmission] = useState(false)
  const ipfsUploadRef = useRef<IPFSUploadRef>(null)

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Initialize the send transaction hook with empty calls
  const { sendAsync } = useSendTransaction({ calls: [] });

  // Get transaction receipt to monitor transaction status
  const { data: receipt, isLoading: isWaitingForReceipt } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
  })

  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed
      toast({
        title: "Product added successfully",
        description: "Your product has been added to the store.",
      })

      // Reset transaction hash
      setTransactionHash("")

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      })

      // Set successful submission flag to trigger tab change
      setSuccessfulSubmission(true)
    }
  }, [receipt, transactionHash])

  // Find the parent Tabs component and switch to products tab after successful submission
  useEffect(() => {
    if (successfulSubmission) {
      // Find the products tab trigger and click it
      const productsTabTrigger = document.querySelector('[value="products"]') as HTMLButtonElement
      if (productsTabTrigger) {
        productsTabTrigger.click()
      }

      // Reset the flag
      setSuccessfulSubmission(false)
    }
  }, [successfulSubmission])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (fileUrl: string) => {
    setFormData((prev) => ({ ...prev, image: fileUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.category || !formData.stock || 
          !formData.description) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Check if we have a file to upload
      if (!ipfsUploadRef.current?.hasFile()) {
        toast({
          title: "Missing product image",
          description: "Please select an image for the product.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Upload the image to IPFS first
      let ipfsUrl
      try {
        ipfsUrl = await ipfsUploadRef.current.uploadToIPFS()
        console.log("Uploaded to IPFS:", ipfsUrl)
        
        // Show success toast for IPFS upload
        toast({
          title: "Image uploaded successfully",
          description: "Image uploaded to IPFS. Now submitting product to contract...",
        })
      } catch (error) {
        console.error("Error uploading to IPFS:", error)
        toast({
          title: "Image upload failed",
          description: "Failed to upload image to IPFS. Please try again.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Convert values to appropriate types for Cairo contract
      const nameAsFelt = shortString.encodeShortString(formData.name);
      const categoryAsFelt = shortString.encodeShortString(formData.category);
      
      // For u32 values (price, stock), convert to integers
      // Convert price from STRK to milliunits for the contract
      const priceAsU32 = strkToMilliunits(formData.price); // Convert to milliunits for contract
      const stockAsU32 = Math.floor(Number(formData.stock)); // Ensure it's an integer
      
      // For ByteArray values (description and image), we just pass the strings directly
      // The contract will handle the conversion to ByteArray
      const description = formData.description;
      
      console.log("Preparing add_product transaction with:", {
        name: nameAsFelt,
        price: priceAsU32, // Now an integer (in milliunits)
        stock: stockAsU32,
        description: description,
        category: categoryAsFelt,
        image: ipfsUrl
      });
      
      // Convert IPFS gateway URL to IPFS URI if needed
      // This ensures consistent format for the contract
      const formattedIpfsUrl = ipfsUrl.includes('ipfs.io/ipfs/') 
        ? 'ipfs://' + ipfsUrl.split('ipfs.io/ipfs/')[1]
        : ipfsUrl.includes('gateway.pinata.cloud/ipfs/') 
          ? 'ipfs://' + ipfsUrl.split('gateway.pinata.cloud/ipfs/')[1]
          : ipfsUrl;
      
      console.log("Formatted IPFS URL:", formattedIpfsUrl);
      
      // Prepare the add_product transaction
      const calls = contract?.populate("add_product", [
        nameAsFelt,
        priceAsU32,
        stockAsU32,
        description,
        categoryAsFelt,
        formattedIpfsUrl // Use the formatted URL
      ])

      if (calls) {
        // Show toast that we're submitting to contract
        toast({
          title: "Submitting to contract",
          description: "Please confirm the transaction in your wallet...",
        })
        
        // Execute the transaction
        console.log("Sending transaction with calls:", calls);
        const response = await sendAsync([calls])
        console.log("Transaction response:", response);
        
        // Store the transaction hash to monitor its status
        if (response.transaction_hash) {
          setTransactionHash(response.transaction_hash)
          
          toast({
            title: "Transaction submitted",
            description: `Transaction hash: ${response.transaction_hash.substring(0, 10)}...`,
          })
        }
      } else {
        throw new Error("Failed to prepare transaction calls");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      
      // Provide more specific error messages based on the error type
      let errorMessage = "There was an error adding the product. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to add the product.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          // Include the actual error message for debugging
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error adding product",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Add a new product to your supermarket. All fields are required.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Organic Bananas"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Fresh organic bananas, bundle of 5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (STRK)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="any"
                min="0"
                placeholder="Enter price (e.g. 0.05, 1, 3.5)"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="1"
                placeholder="25"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <IPFSUpload 
              ref={ipfsUploadRef}
              onChange={handleImageChange} 
              value={formData.image}
              showIPFSInfo={true}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
