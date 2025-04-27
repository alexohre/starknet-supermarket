"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useContract, useReadContract, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { milliunitsToStrk, formatStrkPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { shortString } from "starknet"

// Interface for order items from the contract
interface OrderItem {
  product_id: string
  quantity: number
  price: string
}

// Interface for orders from the contract
interface Order {
  id: string
  buyer: string
  total_cost: string
  timestamp: number
  items_count: number
  status?: 'pending' | 'completed' | 'cancelled' // This might not be in the contract
  items?: OrderItem[] // This will be fetched separately
}

// Interface for the order details modal
interface OrderDetailsProps {
  order: Order | null
  onClose: () => void
  orderItems: OrderItem[]
  productNames: Record<string, string>
}

// Component to display order details
function OrderDetails({ order, onClose, orderItems, productNames }: OrderDetailsProps) {
  if (!order) return null

  // Format timestamp to a readable date
  const orderDate = new Date(Number(order.timestamp) * 1000).toLocaleDateString()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Order Details: #{order.id}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-medium truncate">{order.buyer}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-medium">{formatStrkPrice(order.total_cost)} STRK</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "outline"}>
                {order.status || "Completed"}
              </Badge>
            </div>
          </div>

          <h3 className="font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map((item) => (
                <TableRow key={item.product_id}>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{productNames[item.product_id] || `Product ${item.product_id}`}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatStrkPrice(item.price)} STRK</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productNames, setProductNames] = useState<Record<string, string>>({})
  const ordersPerPage = 5

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Fetch all orders from the contract
  const { data: ordersData, isLoading: isLoadingOrders, refetch: refetchOrders } = useReadContract({
    functionName: "get_all_orders",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: false,
  })

  // Fetch products to get their names
  const { data: productsData, isLoading: isLoadingProducts } = useReadContract({
    functionName: "get_products",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: false,
  })

  // Process the products data to create a mapping of product IDs to names
  useEffect(() => {
    if (productsData && Array.isArray(productsData)) {
      try {
        const nameMap: Record<string, string> = {};
        productsData.forEach((product: any) => {
          const id = String(product.id);
          const name = shortString.decodeShortString(product.name);
          nameMap[id] = name;
        });
        setProductNames(nameMap);
      } catch (error) {
        console.error("Error processing product data:", error);
      }
    }
  }, [productsData]);

  // Process the orders data when it's received
  useEffect(() => {
    if (ordersData && Array.isArray(ordersData)) {
      try {
        // Transform the contract data into our Order interface
        const processedOrders = ordersData.map((item: any) => {
          // Extract values from the contract response
          const id = String(item.id);
          const buyer = item.buyer;
          const total_cost = milliunitsToStrk(Number(item.total_cost)).toString();
          const timestamp = Number(item.timestamp);
          const items_count = Number(item.items_count);

          // For now, we'll assume all orders are completed
          // In a real application, you might have a status field in your contract
          const status = 'completed' as const;

          return {
            id,
            buyer,
            total_cost,
            timestamp,
            items_count,
            status
          };
        });

        // Sort orders by timestamp (newest first)
        const sortedOrders = processedOrders.sort((a, b) => b.timestamp - a.timestamp);

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error processing order data:", error);
        toast({
          title: "Error loading orders",
          description: "There was an error loading the orders. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    } else {
      // If no data or empty array, set empty orders
      if (ordersData !== undefined) {
        setOrders([]);
        setFilteredOrders([]);
        setLoading(false);
      }
    }
  }, [ordersData]);

  // Ensure spinner stops when contract loading completes
  useEffect(() => {
    if (!isLoadingOrders) {
      setLoading(false);
    }
  }, [isLoadingOrders]);

  // Filter orders based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.buyer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, orders]);

  // Fetch order items when an order is selected
  const fetchOrderItems = async (orderId: string) => {
    if (!contract) return;

    try {
      const items = await contract.call("get_order_items", [Number(orderId)]);
      
      if (Array.isArray(items)) {
        const processedItems = items.map((item: any) => {
          return {
            product_id: String(item.product_id),
            quantity: Number(item.quantity),
            price: milliunitsToStrk(Number(item.price)).toString()
          };
        });
        
        return processedItems;
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching items for order ${orderId}:`, error);
      toast({
        title: "Error loading order items",
        description: "There was an error loading the order items. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  // Handle viewing order details
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    const items = await fetchOrderItems(order.id);
    setSelectedOrderItems(items || []); // Ensure we always set an array, even if items is undefined
  };

  // Handle closing the order details modal
  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setSelectedOrderItems([]);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Only show pagination if we have more than one page
  const showPagination = filteredOrders.length > ordersPerPage;

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Handle refreshing the orders
  const handleRefresh = () => {
    setLoading(true);
    refetchOrders();
  };

  // Format a timestamp to a readable date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Truncate wallet address for display
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Recent Orders</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell className="font-medium">
                      {truncateAddress(order.buyer)}
                    </TableCell>
                    <TableCell>{formatDate(order.timestamp)}</TableCell>
                    <TableCell>{formatStrkPrice(order.total_cost)} STRK</TableCell>
                    <TableCell>{order.items_count}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls - only show when we have multiple pages */}
          {showPagination && (
            <div className="flex items-center justify-center space-x-2 py-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={handleCloseDetails} 
          orderItems={selectedOrderItems}
          productNames={productNames}
        />
      )}
    </div>
  )
}
