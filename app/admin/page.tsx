"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AdminProductList } from "@/components/admin/product-list"
import { AdminProductForm } from "@/components/admin/product-form"
import { AdminStats } from "@/components/admin/stats"
import { AdminOrders } from "@/components/admin/orders"
import { AccessControl } from "@/components/admin/access-control"
import { RewardTiers } from "@/components/admin/reward-tiers"
import { useAdminCheck } from "@/hooks/use-admin-check"
import { useAccount } from "@starknet-react/core"
import { notFound } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Package, PlusCircle, Users, Trophy } from "lucide-react"

export default function AdminPage() {
  const { isConnected } = useAccount()
  const { isAdmin, isLoading } = useAdminCheck()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Update URL without full page reload
    const params = new URLSearchParams(searchParams)
    if (value === "overview") {
      params.delete("tab")
    } else {
      params.set("tab", value)
    }
    router.push(`/admin${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
  }
  
  // If not connected, show 404 page
  // if (!isConnected) {
  //   return notFound()
  // }

  // Show loading spinner while checking admin status
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // After loading, if not admin, show 404 page
  // if (!isAdmin) {
  //   return notFound()
  // }

  // Get current tab from URL
  const currentTab = searchParams.get("tab") || "overview"

  // Only render the admin dashboard if the user is connected and an admin
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 flex flex-wrap gap-2 border-b w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="overview" 
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="products"
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <Package className="h-4 w-4 mr-1" />
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="add-product"
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Product
          </TabsTrigger>
          <TabsTrigger 
            value="orders"
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Orders
          </TabsTrigger>
          <TabsTrigger 
            value="reward-tiers"
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <Trophy className="h-4 w-4 mr-1" />
            Reward Tiers
          </TabsTrigger>
          <TabsTrigger 
            value="access-control"
            className="flex items-center data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-4 py-2 data-[state=active]:shadow-none"
          >
            <Users className="h-4 w-4 mr-1" />
            Access Control
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <AdminStats />
        </TabsContent>
        
        <TabsContent value="products" className="mt-4">
          <AdminProductList />
        </TabsContent>
        
        <TabsContent value="add-product" className="mt-4">
          <AdminProductForm />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-4">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="reward-tiers" className="mt-4">
          <RewardTiers />
        </TabsContent>
        
        <TabsContent value="access-control" className="mt-4">
          <AccessControl />
        </TabsContent>
      </Tabs>
    </div>
  )
}
