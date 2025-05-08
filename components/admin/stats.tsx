"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, DollarSign, ShoppingBag, Users, Package } from "lucide-react"
import { WithdrawModal } from "@/components/admin/withdraw-modal"
import { useAccount, useReadContract } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { formatStrkPriceNatural } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export function AdminStats() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [totalSales, setTotalSales] = useState<string>("0")
  const [productCount, setProductCount] = useState<number>(0)
  const [adminCount, setAdminCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const { address } = useAccount()
  
  // Get total sales from contract
  const { data: totalSalesData, isLoading: isLoadingSales } = useReadContract({
    functionName: "get_total_sales",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })
  
  // Get products from contract to count them
  const { data: productsData, isLoading: isLoadingProducts } = useReadContract({
    functionName: "get_products",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })
  
  // Get admin count from contract
  const { data: adminCountData, isLoading: isLoadingAdmins } = useReadContract({
    functionName: "get_admin_count",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })
  
  // Process the data when it's received
  useEffect(() => {
    if (totalSalesData !== undefined && productsData !== undefined && adminCountData !== undefined) {
      try {
        // Convert total sales from milliunits to STRK
        const salesInStrk = formatStrkPriceNatural(Number(totalSalesData)).toString();
        setTotalSales(salesInStrk);
        
        // Count products
        const products = Array.isArray(productsData) ? productsData : [];
        setProductCount(products.length);
        
        // Set admin count
        setAdminCount(Number(adminCountData));
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing stats data:", error);
        toast({
          title: "Error loading stats",
          description: "There was an error loading the statistics. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }
  }, [totalSalesData, productsData, adminCountData]);

  // Preloader for the entire component
  if (isLoading || isLoadingSales || isLoadingProducts || isLoadingAdmins) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                <div className="text-2xl font-bold">{formatStrkPriceNatural(totalSales)}</div>
                <p className="text-xs text-muted-foreground">From all sales</p>
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
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">Total products in store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
            <p className="text-xs text-muted-foreground">Store administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Wallet</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Not connected'}</div>
            <p className="text-xs text-muted-foreground">Connected wallet</p>
          </CardContent>
        </Card>
      </div>

      <WithdrawModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        availableBalance={totalSales}
        walletAddress={address || ''}
      />
    </div>
  )
}
