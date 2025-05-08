"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { EditProductModal } from "@/components/admin/edit-product-modal"
import { DeleteConfirmation } from "@/components/admin/delete-confirmation"
import { toast } from "@/components/ui/use-toast"
import { useContract, useReadContract } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"
import { milliunitsToStrk, formatStrkPriceNatural } from "@/lib/utils"

// Product interface based on the contract's Product struct
interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  category: string;
  image?: string;
}

export function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6
  
  // Use the useContractRead hook to fetch products
  const { data, isLoading: isLoadingProducts, refetch } = useReadContract({
    functionName: "get_products",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: false, // Set to true if you want to auto-refresh when chain updates
  })

  // Process the products data when it's received
  useEffect(() => {
    if (data && Array.isArray(data)) {
      try {
        // Transform the contract data into our Product interface
        const processedProducts = data.map((item: any) => {
          // Extract values from the contract response
          const id = String(item.id);
          const name = shortString.decodeShortString(item.name);
          const price = milliunitsToStrk(Number(item.price)).toString();
          const stock = Number(item.stock);
          const description = item.description; // ByteArray is returned as string
          const category = shortString.decodeShortString(item.category);
          const image = item.image; // ByteArray is returned as string

          return {
            id,
            name,
            price,
            stock,
            description,
            category,
            image
          };
        });

        setProducts(processedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error processing product data:", error);
        toast({
          title: "Error loading products",
          description: "There was an error loading the products. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } else {
      // If no data or empty array, set empty products
      if (data !== undefined) {
        setProducts([]);
        setIsLoading(false);
      }
    }
  }, [data]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  
  // Only show pagination if we have more than one page
  const showPagination = filteredProducts.length > productsPerPage

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = (updatedProduct: Product) => {
    // In a real app, you would call the Starknet contract to update the product
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
    toast({
      title: "Product updated",
      description: `${updatedProduct.name} has been updated successfully.`,
    })
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    // In a real app, you would call the Starknet contract to delete the product
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setProducts(products.filter((product) => product.id !== productToDelete?.id))
        toast({
          title: "Product deleted",
          description: `${productToDelete?.name} has been deleted successfully.`,
        })
        resolve()
      }, 1000)
    })
  }

  const handleRefresh = () => {
    setIsLoading(true);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (STRK)</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center h-full">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>{formatStrkPriceNatural(product.price)}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls - only show when we have multiple pages */}
      {showPagination && (
        <div className="flex items-center justify-center space-x-2 py-4">
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
        productId={productToDelete?.id}
        onSuccess={refetch}
      />
    </div>
  )
}
