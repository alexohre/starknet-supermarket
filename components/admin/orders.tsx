"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: string
}

interface Order {
  id: string
  customer: string
  date: string
  total: string
  status: 'pending' | 'completed' | 'cancelled'
  items: OrderItem[]
}

// Mock order data - in a real app, this would come from the Starknet contract
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "0x1234...5678",
    date: "2025-04-22",
    total: "0.025",
    status: "pending",
    items: [
      { id: "1", name: "Organic Bananas", quantity: 2, price: "0.005" },
      { id: "3", name: "Free Range Eggs", quantity: 1, price: "0.004" },
      { id: "7", name: "Organic Spinach", quantity: 3, price: "0.002" },
    ],
  },
  {
    id: "ORD-002",
    customer: "0x9876...4321",
    date: "2025-04-23",
    total: "0.018",
    status: "completed",
    items: [
      { id: "2", name: "Whole Grain Bread", quantity: 1, price: "0.003" },
      { id: "6", name: "Ground Coffee", quantity: 1, price: "0.009" },
      { id: "8", name: "Chocolate Chip Cookies", quantity: 1, price: "0.004" },
    ],
  },
  {
    id: "ORD-003",
    customer: "0x5432...7890",
    date: "2025-04-24",
    total: "0.021",
    status: "pending",
    items: [
      { id: "4", name: "Organic Milk", quantity: 2, price: "0.006" },
      { id: "9", name: "Sparkling Water", quantity: 1, price: "0.005" },
      { id: "11", name: "Organic Apples", quantity: 1, price: "0.006" },
    ],
  },
  {
    id: "ORD-004",
    customer: "0x6789...0123",
    date: "2025-04-24",
    total: "0.012",
    status: "cancelled",
    items: [
      { id: "10", name: "Grass-Fed Beef", quantity: 1, price: "0.012" },
    ],
  },
  {
    id: "ORD-005",
    customer: "0x2468...1357",
    date: "2025-04-25",
    total: "0.014",
    status: "pending",
    items: [
      { id: "5", name: "Avocados", quantity: 2, price: "0.007" },
    ],
  },
  {
    id: "ORD-006",
    customer: "0x1357...2468",
    date: "2025-04-25",
    total: "0.011",
    status: "completed",
    items: [
      { id: "12", name: "Almond Milk", quantity: 1, price: "0.004" },
      { id: "8", name: "Chocolate Chip Cookies", quantity: 1, price: "0.004" },
      { id: "7", name: "Organic Spinach", quantity: 1, price: "0.002" },
    ],
  },
  {
    id: "ORD-007",
    customer: "0x8642...9753",
    date: "2025-04-25",
    total: "0.009",
    status: "pending",
    items: [
      { id: "6", name: "Ground Coffee", quantity: 1, price: "0.009" },
    ],
  },
  {
    id: "ORD-008",
    customer: "0x9753...8642",
    date: "2025-04-26",
    total: "0.016",
    status: "completed",
    items: [
      { id: "4", name: "Organic Milk", quantity: 1, price: "0.006" },
      { id: "5", name: "Avocados", quantity: 1, price: "0.007" },
      { id: "7", name: "Organic Spinach", quantity: 1, price: "0.002" },
    ],
  },
]

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5

  useEffect(() => {
    // Simulate loading orders from Starknet contract
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch orders from the Starknet contract here
        setTimeout(() => {
          setOrders(mockOrders)
          setFilteredOrders(mockOrders)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders)
      setCurrentPage(1)
      return
    }

    const lowercasedSearch = searchTerm.toLowerCase()
    const results = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(lowercasedSearch) ||
        order.customer.toLowerCase().includes(lowercasedSearch) ||
        order.date.toLowerCase().includes(lowercasedSearch) ||
        order.status.toLowerCase().includes(lowercasedSearch)
    )

    setFilteredOrders(results)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchTerm, orders])

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, you would update the order status on the Starknet contract here
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    
    setOrders(updatedOrders)
    setFilteredOrders(updatedOrders.filter(
      (order) =>
        searchTerm.trim() === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    
    // Close the details modal after updating
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Recent Orders</CardTitle>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    {searchTerm ? "No orders found matching your search" : "No orders found"}
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="font-mono text-xs">{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total} STRK</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order Details: {selectedOrder.id}</span>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">Customer</h3>
                    <p className="font-mono text-sm">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Date</h3>
                    <p>{selectedOrder.date}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Status</h3>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Total</h3>
                    <p className="font-bold">{selectedOrder.total} STRK</p>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.price} STRK</TableCell>
                          <TableCell className="text-right">
                            {(parseFloat(item.price) * item.quantity).toFixed(6)} STRK
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedOrder.status === "pending" && (
                  <div className="flex gap-2 justify-end mt-4">
                    <Button 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-300 text-green-600 hover:bg-green-50"
                      onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
