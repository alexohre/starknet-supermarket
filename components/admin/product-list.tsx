"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2 } from "lucide-react"
import { EditProductModal } from "@/components/admin/edit-product-modal"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { toast } from "@/components/ui/use-toast"

// Mock product data - in a real app, this would come from the Starknet contract
const mockProducts = [
  {
    id: "1",
    name: "Organic Bananas",
    description: "Fresh organic bananas, bundle of 5",
    price: "0.005",
    category: "Fruits",
    stock: 25,
  },
  {
    id: "2",
    name: "Whole Grain Bread",
    description: "Freshly baked whole grain bread",
    price: "0.003",
    category: "Bakery",
    stock: 15,
  },
  {
    id: "3",
    name: "Free Range Eggs",
    description: "Dozen free range eggs",
    price: "0.004",
    category: "Dairy",
    stock: 30,
  },
  {
    id: "4",
    name: "Organic Milk",
    description: "1 gallon of organic whole milk",
    price: "0.006",
    category: "Dairy",
    stock: 20,
  },
  {
    id: "5",
    name: "Avocados",
    description: "Ripe avocados, pack of 4",
    price: "0.007",
    category: "Fruits",
    stock: 18,
  },
  {
    id: "6",
    name: "Ground Coffee",
    description: "Premium ground coffee, 12oz bag",
    price: "0.009",
    category: "Beverages",
    stock: 22,
  },
]

export function AdminProductList() {
  const [products, setProducts] = useState(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedProduct: any) => {
    // In a real app, you would call the Starknet contract to update the product
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    toast({
      title: "Product updated",
      description: `${updatedProduct.name} has been updated successfully.`,
    })
  }

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    // In a real app, you would call the Starknet contract to delete the product
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProducts(products.filter((product) => product.id !== productToDelete.id))
        toast({
          title: "Product deleted",
          description: `${productToDelete.name} has been deleted successfully.`,
        })
        resolve()
      }, 1000)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (STRK)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditProductModal
        product={editingProduct}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmation
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName={productToDelete?.name || "this product"}
      />
    </div>
  )
}
