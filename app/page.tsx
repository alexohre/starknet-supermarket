import { ProductList } from "@/components/product-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"

export default function StorePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
          <div className="mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to StarkMarket</h1>
            <p className="text-lg mb-6">
              The first decentralized supermarket built on Starknet. Shop with confidence using cryptocurrency.
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border-white"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-8" id="product-search" />
          </div>
        </div>

        <ProductList />
      </div>
    </div>
  )
}
