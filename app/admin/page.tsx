"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminProductList } from "@/components/admin/product-list"
import { AdminProductForm } from "@/components/admin/product-form"
import { AdminStats } from "@/components/admin/stats"
import { AdminOrders } from "@/components/admin/orders"
import { AccessControl } from "@/components/admin/access-control"
import { ShieldAlert, Users, ShoppingBag } from "lucide-react"

export default function AdminPage() {
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking if the connected wallet is the owner
    const checkOwner = async () => {
      try {
        // In a real app, you would check if the connected wallet is the owner
        setTimeout(() => {
          // For demo purposes, we'll set isOwner to true
          setIsOwner(true)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error checking owner:", error)
        setIsLoading(false)
      }
    }

    checkOwner()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <ShieldAlert className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
            <CardDescription>You need to be the owner of the contract to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Please connect with the owner wallet to manage the supermarket.
            </p>
            <Button variant="outline" className="w-full">
              Connect Owner Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
