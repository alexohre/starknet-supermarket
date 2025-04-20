"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/cart/cart-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"

export function CartDropdown() {
  const { items, removeItem, updateQuantity, itemCount, total } = useCart()
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout or trigger a Starknet transaction
    alert("Checkout functionality would be implemented here with Starknet transactions")
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {itemCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Shopping Cart</h3>
          <span className="text-xs text-muted-foreground">{itemCount} items</span>
        </div>
        <Separator />

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" className="mt-4" onClick={() => setOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px] p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium">{item.name}</h4>
                      <p className="text-sm font-bold">{item.price} STRK</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 space-y-4">
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{total} STRK</span>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
