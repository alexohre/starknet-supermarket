"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock product data - in a real app, this would come from the Starknet contract
const mockProducts = [
  {
    id: "1",
    name: "Organic Bananas",
    description: "Fresh organic bananas, bundle of 5",
    price: "0.005",
    image: "/products/bananas.jpg",
    category: "Fruits",
    stock: 25,
  },
  {
    id: "2",
    name: "Whole Grain Bread",
    description: "Freshly baked whole grain bread",
    price: "0.003",
    image: "/products/bread.jpg",
    category: "Bakery",
    stock: 15,
  },
  {
    id: "3",
    name: "Free Range Eggs",
    description: "Dozen free range eggs",
    price: "0.004",
    image: "/products/eggs.jpg",
    category: "Dairy",
    stock: 30,
  },
  {
    id: "4",
    name: "Organic Milk",
    description: "1 gallon of organic whole milk",
    price: "0.006",
    image: "/products/milk.jpg",
    category: "Dairy",
    stock: 20,
  },
  {
    id: "5",
    name: "Avocados",
    description: "Ripe avocados, pack of 4",
    price: "0.007",
    image: "/products/avocados.jpg",
    category: "Fruits",
    stock: 18,
  },
  {
    id: "6",
    name: "Ground Coffee",
    description: "Premium ground coffee, 12oz bag",
    price: "0.009",
    image: "/products/coffee.jpg",
    category: "Beverages",
    stock: 22,
  },
  {
    id: "7",
    name: "Organic Spinach",
    description: "Fresh organic spinach, 8oz bag",
    price: "0.002",
    image: "/products/spinach.jpg",
    category: "Vegetables",
    stock: 40,
  },
  {
    id: "8",
    name: "Chocolate Chip Cookies",
    description: "Freshly baked cookies, pack of 12",
    price: "0.004",
    image: "/products/cookies.jpg",
    category: "Bakery",
    stock: 35,
  },
  {
    id: "9",
    name: "Sparkling Water",
    description: "12-pack of sparkling water",
    price: "0.005",
    image: "/products/water.jpg",
    category: "Beverages",
    stock: 50,
  },
  {
    id: "10",
    name: "Grass-Fed Beef",
    description: "1lb of premium grass-fed ground beef",
    price: "0.012",
    image: "/products/beef.jpg",
    category: "Meat",
    stock: 15,
  },
  {
    id: "11",
    name: "Organic Apples",
    description: "Organic apples, bag of 6",
    price: "0.006",
    image: "/products/apples.jpg",
    category: "Fruits",
    stock: 30,
  },
  {
    id: "12",
    name: "Almond Milk",
    description: "Unsweetened almond milk, 64oz",
    price: "0.004",
    image: "/products/almond-milk.jpg",
    category: "Dairy",
    stock: 25,
  },
]

export function ProductList() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const productsPerPage = 6

  useEffect(() => {
    // Simulate loading products from Starknet contract
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch products from the Starknet contract here
        setTimeout(() => {
          setProducts(mockProducts)
          setFilteredProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 h-[300px] animate-pulse bg-muted"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
