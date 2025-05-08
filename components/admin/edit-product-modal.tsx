"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"
import { strkToMilliunits, milliunitsToStrk, formatStrkPriceNatural } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: string
  category: string
  stock: number
  image?: string
}

interface EditProductModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Product) => void
}

export function EditProductModal({ product, open, onOpenChange, onSave }: EditProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    image: "",
  })
  const [transactionHash, setTransactionHash] = useState<string>("")

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Use the useSendTransaction hook to call the update_product function
  const { sendAsync } = useSendTransaction({ calls: [] })

  // Get transaction receipt to monitor transaction status
  const { data: receipt, isLoading: isWaitingForReceipt } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
  })

  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed, update UI and close modal
      toast({
        title: "Product updated successfully",
        description: `${formData.name} has been updated.`,
      })

      // Update the UI with the updated product
      onSave(formData)

      // Reset transaction hash and close modal
      setTransactionHash("")
      onOpenChange(false)
    }
  }, [receipt, transactionHash, formData, onSave, onOpenChange])

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      // If price includes 'STRK', remove it for the input field
      let cleanPrice = product.price;
      if (product.price.includes('STRK')) {
        cleanPrice = product.price.replace(' STRK', '');
      }
      
      // If the price is from the contract (in milliunits), convert it to STRK
      // This handles the case where the price might be stored as milliunits in the contract
      if (Number(cleanPrice) > 1000) { // Heuristic to detect if it might be in milliunits
        try {
          const possibleMilliunits = Number(cleanPrice);
          if (possibleMilliunits % 1 === 0 && possibleMilliunits >= 1000) { // If it's a large integer
            cleanPrice = milliunitsToStrk(possibleMilliunits).toString();
          }
        } catch (e) {
          // If conversion fails, keep the original price
          console.log("Price conversion failed, keeping original", e);
        }
      }
        
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: cleanPrice,
        category: product.category,
        stock: product.stock,
        image: product.image || "",
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  // Update the FileUpload usage in EditProductModal to show the existing URL
  const handleImageChange = (fileUrl: string) => {
    setFormData((prev) => ({ ...prev, image: fileUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.name || !formData.price || !formData.category || formData.stock <= 0) {
        setError("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      // For u32 values (price, stock), convert to integers
      // Convert price from STRK to milliunits for the contract
      const priceAsU32 = strkToMilliunits(formData.price); // Convert to milliunits for contract
      const stockAsU32 = Math.floor(Number(formData.stock)); // Ensure it's an integer
      const idAsU32 = Number(formData.id); // Convert ID to number
      const name = shortString.encodeShortString(formData.name);
      const description = formData.description;
      const category = shortString.encodeShortString(formData.category);
      const image = formData.image;

      // Prepare the update_product transaction
      const calls = contract?.populate("update_product", [
        idAsU32, // product ID
        name, // name as felt252
        priceAsU32, // price as u32 (in milliunits)
        stockAsU32, // stock as u32
        description, // description as ByteArray
        category, // category as felt252
        image || "", // image as ByteArray (empty string if undefined)
      ]);

      // Send the transaction
      if (calls) {
        console.log("Updating product:", {
          id: idAsU32,
          name: formData.name,
          price: priceAsU32,
          stock: stockAsU32,
          description: formData.description,
          category: formData.category,
          image: formData.image,
        });

        const response = await sendAsync([calls]);

        // Store the transaction hash to monitor its status
        if (response.transaction_hash) {
          setTransactionHash(response.transaction_hash)
        }

        // Don't update UI or close modal yet - wait for transaction receipt
      }
    } catch (error: any) {
      console.error("Error updating product:", error);

      // Handle user rejection separately
      if (error.message?.includes("UserRejectedRequestError")) {
        setError("Transaction rejected by user");
      } else {
        setError("Failed to update product. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to the product details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
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
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Product Image</Label>
              <FileUpload 
                onChange={handleImageChange} 
                value={formData.image} 
                showExistingUrl={true}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
