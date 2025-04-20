"use client"

import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/components/cart/cart-context"

interface ProductImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: {
    id: string
    name: string
    description: string
    price: string
    image: string
    category: string
    stock: number
  }
}

export function ProductImageModal({ open, onOpenChange, product }: ProductImageModalProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items } = useCart()

  // Check if product is already in cart
  const isInCart = items.some((item) => item.id === product.id)

  const handleAddToCart = async () => {
    if (isInCart) return

    setIsAdding(true)

    // Simulate adding to cart with Starknet transaction
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "/placeholder.svg",
      })

      setIsAdding(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image section */}
          <div className="relative w-full h-[300px] md:h-[500px] bg-muted">
            <Image
              src={product.image || "/placeholder.svg?height=500&width=500"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Product details section */}
          <div className="p-6 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-primary">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
              </div>

              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-xl font-semibold mb-4">{product.price} STRK</p>

              <div className="space-y-4">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" onClick={handleAddToCart} disabled={isAdding || isInCart}>
                {isAdding ? (
                  <span className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : isInCart ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Added to Cart
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
