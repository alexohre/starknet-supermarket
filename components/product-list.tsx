"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useReadContract } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"
import { milliunitsToStrk } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Helper function to process product data from contract
function processContractProducts(data: any[]) {
  if (!data || !Array.isArray(data)) return [];
  
  try {
    // Transform the contract data into our Product interface
    return data.map((item: any) => {
      // Extract values from the contract response
      const id = String(item.id);
      const name = shortString.decodeShortString(item.name);
      // First convert from milliunits to STRK, then format with natural formatting
      const price = milliunitsToStrk(Number(item.price));
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
  } catch (error) {
    console.error("Error processing product data:", error);
    return [];
  }
}

export function ProductList() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const productsPerPage = 6

  // Use the useReadContract hook to fetch products from the contract
  const { data, isLoading: isLoadingProducts } = useReadContract({
    functionName: "get_products",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: true, // Set to true if you want to auto-refresh when chain updates
  })

  // Process the products data when it's received
  useEffect(() => {
    if (data && Array.isArray(data)) {
      try {
        // Process the contract data
        const processedProducts = processContractProducts(data)
        
        if (processedProducts && processedProducts.length > 0) {
          // Use products from contract if available
          setProducts(processedProducts)
          setFilteredProducts(processedProducts)
          
          console.log("USING CONTRACT PRODUCTS:", processedProducts)
          
          toast({
            title: "Products loaded from blockchain",
            description: `${processedProducts.length} products loaded from Starknet contract.`,
            variant: "default"
          })
        } else {
          // No products found in contract
          console.log("No products found in contract")
          setProducts([])
          setFilteredProducts([])
          
          toast({
            title: "No products found",
            description: "No products found in the contract.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error processing product data:", error)
        // Set empty products on error
        setProducts([])
        setFilteredProducts([])
        
        toast({
          title: "Error loading products",
          description: "Failed to load products from contract.",
          variant: "destructive"
        })
      }
    } else {
      // If no data from contract, set empty products
      setProducts([])
      setFilteredProducts([])
      
      toast({
        title: "No products available",
        description: "No data received from contract.",
        variant: "destructive"
      })
    }
    
    setLoading(false)
  }, [data])

  // Set up search functionality
  useEffect(() => {
    // Connect to the search input in the parent component
    const searchInput = document.getElementById("product-search") as HTMLInputElement

    if (searchInput) {
      const handleSearch = () => {
        const term = searchInput.value.toLowerCase()
        setSearchTerm(term)

        // Reset to first page when searching
        if (term !== searchTerm) {
          setCurrentPage(1)
        }

        // Filter products based on search term
        const filtered = products.filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term),
        )

        setFilteredProducts(filtered)
      }

      // Add event listener
      searchInput.addEventListener("input", handleSearch)

      // Clean up
      return () => {
        searchInput.removeEventListener("input", handleSearch)
      }
    }
  }, [products, searchTerm])

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-6">

      {/* Product grid or loading/empty state */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-sm text-gray-500 mt-1">There are no products available in the supermarket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination - only show if we have products and more than one page */}
      {filteredProducts.length > productsPerPage && (
        <div className="flex justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-3 py-2 bg-gray-100 rounded-md">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
