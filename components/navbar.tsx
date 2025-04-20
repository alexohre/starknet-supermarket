"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ShoppingCart } from "lucide-react"
import { CartDropdown } from "@/components/cart/cart-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Store", href: "/" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    { name: "Admin", href: "/admin" },
  ]

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <MobileNav navItems={navItems} />
          <Link href="/" className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">StarkMarket</span>
          </Link>
        </div>

        <nav className="mx-6 hidden md:flex items-center space-x-6 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <CartDropdown />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
