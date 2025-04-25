import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { CartProvider } from "@/components/cart/cart-context"
import { StarknetProvider } from "@/components/starknet-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Starknet Supermarket",
  description: "A decentralized supermarket built on Starknet",
  generator: 'v0.dev',
  icons: {
    icon: '/favcart.png',
    shortcut: '/favcart.png',
    apple: '/favcart.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <StarknetProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <footer className="py-6 border-t">
                  <div className="container mx-auto text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Starknet Supermarket. All rights reserved.
                  </div>
                </footer>
              </div>
            </CartProvider>
          </ThemeProvider>
        </StarknetProvider>
      </body>
    </html>
  )
}
