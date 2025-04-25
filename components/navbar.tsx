"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ShoppingCart } from "lucide-react"
import { CartDropdown } from "@/components/cart/cart-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { useAccount } from "@starknet-react/core"
import { useAdminCheck } from "@/hooks/use-admin-check"

export default function Navbar() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const { isAdmin, isLoading } = useAdminCheck()

  // Define base nav items (available to all users)
  const baseNavItems = [
    { name: "Store", href: "/" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ]

  // Add admin item conditionally
  const navItems = isConnected && isAdmin 
    ? [...baseNavItems, { name: "Admin", href: "/admin" }] 
    : baseNavItems

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Left section - Logo and mobile nav */}
        <div className="flex items-center w-1/4">
          <MobileNav navItems={navItems} />
          <Link href="/" className="flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">StarkMarket</span>
          </Link>
        </div>

        {/* Center section - Navigation links */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-6">
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
        </div>

        {/* Right section - Theme toggle, cart, wallet */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-1/4 justify-end">
          <ThemeToggle />
          <CartDropdown />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
