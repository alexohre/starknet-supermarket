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
import { Loader2 } from "lucide-react"
import { FileUpload } from "@/components/file-upload"

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
  const [formData, setFormData] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    image: "",
  })

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
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

    try {
      // In a real app, you would call the Starknet contract to update the product
      console.log("Updating product:", formData)

      // Simulate a successful transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSave(formData)

      toast({
        title: "Product updated successfully",
        description: `${formData.name} has been updated.`,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error updating product",
        description: "There was an error updating the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Make changes to the product details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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
                  step="0.001"
                  min="0"
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
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <FileUpload onChange={handleImageChange} value={formData.image} showExistingUrl={true} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
