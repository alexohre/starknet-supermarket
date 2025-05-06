"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Wallet, ShoppingBag, Eye, ArrowRight, Loader2 } from "lucide-react"
import { useAccount, useBalance, useContract, useReadContract } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { formatStrkPrice } from "@/lib/utils"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: string
  totalAmount: number
  status: "completed" | "processing" | "cancelled"
  items: OrderItem[]
}

export function UserDashboard() {
  const { address } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  
  // Get wallet balance
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    watch: true,
  })

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Read user orders from contract
  const { data: ordersData, isLoading: isOrdersLoading } = useReadContract({
    functionName: "get_user_orders",
    args: [address],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: true,
  })

  // Process orders data when it's available
  useEffect(() => {
    if (ordersData) {
      try {
        // This is a placeholder for processing the contract data
        // The actual implementation will depend on your contract's return format
        const processedOrders = Array.isArray(ordersData) 
          ? ordersData.map((order: any, index: number) => ({
              id: order.id || String(index + 1),
              date: new Date(order.timestamp * 1000).toLocaleDateString() || new Date().toLocaleDateString(),
              totalAmount: Number(order.total_amount || 0),
              status: order.status || "completed",
              items: Array.isArray(order.items) 
                ? order.items.map((item: any) => ({
                    productId: item.product_id || "",
                    name: item.name || "Unknown Product",
                    price: Number(item.price || 0),
                    quantity: Number(item.quantity || 1)
                  }))
                : []
            }))
          : [];
        
        setOrders(processedOrders);
      } catch (error) {
        console.error("Error processing orders:", error);
        toast({
          title: "Error loading orders",
          description: "Failed to load your orders from the contract.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [ordersData]);

  // For demo purposes, add some mock data if no orders are available
  useEffect(() => {
    // Only add mock data if the contract data has been attempted to be loaded
    if (!isOrdersLoading && orders.length === 0) {
      setOrders([
        {
          id: "ORD-001",
          date: "2025-05-01",
          totalAmount: 0.015,
          status: "completed",
          items: [
            { productId: "1", name: "Organic Bananas", price: 0.005, quantity: 1 },
            { productId: "2", name: "Whole Grain Bread", price: 0.003, quantity: 2 },
            { productId: "3", name: "Free Range Eggs", price: 0.004, quantity: 1 }
          ]
        },
        {
          id: "ORD-002",
          date: "2025-05-03",
          totalAmount: 0.01,
          status: "completed",
          items: [
            { productId: "4", name: "Organic Milk", price: 0.006, quantity: 1 },
            { productId: "5", name: "Avocados", price: 0.004, quantity: 1 }
          ]
        },
        {
          id: "ORD-003",
          date: "2025-05-05",
          totalAmount: 0.008,
          status: "processing",
          items: [
            { productId: "6", name: "Chicken Breast", price: 0.008, quantity: 1 }
          ]
        }
      ]);
      setIsLoading(false);
    }
  }, [isOrdersLoading, orders.length]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const getTotalOrderCount = () => {
    return orders.length;
  };

  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Wallet Balance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              Wallet Balance
            </CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            {isBalanceLoading ? (
              <div className="flex items-center h-12">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Loading balance...</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-3xl font-bold">
                  {balance ? formatStrkPrice(balance.toString()) : "0"}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  Wallet Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
            <CardDescription>Your order history summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{getTotalOrderCount()}</span>
              <span className="text-sm text-muted-foreground">Total Orders</span>
              
              <div className="mt-4 flex items-center">
                <span className="text-lg font-medium">
                  {formatStrkPrice(getTotalSpent().toString())}
                </span>
                <span className="text-sm text-muted-foreground ml-2">Total Spent</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>View your order history and details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{formatStrkPrice(order.totalAmount.toString())} </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          order.status === "completed" ? "default" : 
                          order.status === "processing" ? "outline" : "destructive"
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                You haven't placed any orders yet.
              </p>
              <Button asChild>
                <a href="/">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <div className="text-sm text-muted-foreground">
              {selectedOrder && (
                <div className="flex justify-between items-center mt-1">
                  <span>Order ID: {selectedOrder.id}</span>
                  <Badge 
                    variant={
                      selectedOrder.status === "completed" ? "default" : 
                      selectedOrder.status === "processing" ? "outline" : "destructive"
                    }
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </div>
              )}
            </div>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Date: {selectedOrder.date}</span>
                  <span>Total: {formatStrkPrice(selectedOrder.totalAmount.toString())} </span>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{formatStrkPrice(item.price.toString())} </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatStrkPrice((item.price * item.quantity).toString())} </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatStrkPrice(selectedOrder.totalAmount.toString())} </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
