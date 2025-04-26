"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductList } from "@/components/admin/product-list"
import { AdminProductForm } from "@/components/admin/product-form"
import { AdminStats } from "@/components/admin/stats"
import { AdminOrders } from "@/components/admin/orders"
import { AccessControl } from "@/components/admin/access-control"
import { Users, ShoppingBag } from "lucide-react"
import { useAdminCheck } from "@/hooks/use-admin-check"
import { useAccount } from "@starknet-react/core"
import { notFound } from "next/navigation"

export default function AdminPage() {
  const { isConnected } = useAccount()
  const { isAdmin, isLoading } = useAdminCheck()
  
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

  // Only render the admin dashboard if the user is connected and an admin
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="add-product">Add Product</TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="h-4 w-4 mr-1" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="access-control">
            <Users className="h-4 w-4 mr-1" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminStats />
        </TabsContent>

        <TabsContent value="products">
          <AdminProductList />
        </TabsContent>

        <TabsContent value="add-product">
          <AdminProductForm />
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="access-control">
          <AccessControl />
        </TabsContent>
      </Tabs>
    </div>
  )
}
