import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About StarkMarket</h1>

        <div className="prose max-w-none mb-8">
          <p className="text-lg text-muted-foreground mb-4">
            StarkMarket is the world's first decentralized supermarket built on Starknet, bringing the power of
            blockchain technology to everyday shopping.
          </p>

          <p className="mb-4">
            Our mission is to create a transparent, secure, and efficient marketplace where customers can purchase
            everyday items using cryptocurrency, with all transactions recorded on the blockchain for maximum
            transparency and security.
          </p>

          <p className="mb-8">
            Founded in 2023, StarkMarket is pioneering the future of retail by leveraging the power of Starknet's Layer
            2 scaling solution to provide fast, low-cost transactions while maintaining the security guarantees of
            Ethereum.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Why Choose StarkMarket?</h2>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure & Transparent</h3>
                <p className="text-sm text-muted-foreground">
                  All transactions are recorded on the blockchain, ensuring complete transparency and security for every
                  purchase.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Fast & Low-Cost</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by Starknet's Layer 2 technology, transactions are fast and gas fees are minimal compared to
                  traditional blockchain solutions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Global Access</h3>
                <p className="text-sm text-muted-foreground">
                  Anyone with a Starknet wallet can shop at StarkMarket, regardless of location or traditional banking
                  access.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/">Start Shopping Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
