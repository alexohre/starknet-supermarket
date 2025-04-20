"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Users, DollarSign, BarChart3, ArrowUpRight } from "lucide-react"
import { WithdrawModal } from "@/components/admin/withdraw-modal"

export function AdminStats() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const availableBalance = "0.245"
  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{availableBalance} STRK</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </div>
              <Button size="sm" onClick={() => setIsWithdrawModalOpen(true)}>
                <ArrowUpRight className="mr-1 h-4 w-4" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">6 added this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 completed today</p>
          </CardContent>
        </Card>
      </div>

      <WithdrawModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        availableBalance={availableBalance}
        walletAddress={walletAddress}
      />
    </div>
  )
}
