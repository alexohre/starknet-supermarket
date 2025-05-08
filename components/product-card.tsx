"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { ProductImageModal } from "@/components/product-image-modal"
import { milliunitsToStrk, formatStrkPriceNatural } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
  stock: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const { addItem, items } = useCart()

  // Check if product is already in cart
  const isInCart = items.some((item) => item.id === product.id)

  // Reset isAdded state when item is removed from cart
  useEffect(() => {
    if (!isInCart) {
      setIsAdded(false)
    }
  }, [isInCart])

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
      setIsAdded(true)
    }, 1000)
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full cursor-pointer" onClick={() => setImageModalOpen(true)}>
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            <Badge className="absolute top-2 right-2 bg-primary">{product.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {product.description && product.description.length > 60
              ? `${product.description.substring(0, 60)}...`
              : product.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">
              {/* First convert from milliunits to STRK if needed, then format */}
              {Number(product.price) > 1000 && !product.price.includes('STRK')
                ? formatStrkPriceNatural(milliunitsToStrk(Number(product.price)))
                : formatStrkPriceNatural(product.price)}
            </div>
            <div className="text-sm text-muted-foreground">{product.stock} in stock</div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
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
        </CardFooter>
      </Card>

      <ProductImageModal open={imageModalOpen} onOpenChange={setImageModalOpen} product={product} />
    </>
  )
}
