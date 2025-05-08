"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useContract, useSendTransaction, useTransactionReceipt, useBalance } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { useAccount } from "@starknet-react/core"
import { strkToMilliunits, formatStrkPriceNatural } from "@/lib/utils"

// STRK token address on Starknet
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

export function CheckoutButton() {
  const { items, clearCart, total } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const { address } = useAccount()
  
  // Get STRK balance
  const { data: balance } = useBalance({
    address,
    token: STRK_TOKEN_ADDRESS,
  })
  
  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Initialize the send transaction hook with empty calls
  const { sendAsync } = useSendTransaction({ calls: [] });

  // Get transaction receipt to monitor transaction status
  const { data: receipt, isLoading: isWaitingForReceipt } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
  })

  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed
      setStatusMessage({
        type: 'success',
        message: 'Purchase successful! Your order has been placed.'
      })

      // Reset transaction hash
      setTransactionHash("")
      
      // Clear the cart after successful purchase
      clearCart()
      
      // Reset submission state
      setIsSubmitting(false)
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }, [receipt, transactionHash, clearCart])

  const handleCheckout = async () => {
    if (!address) {
      setStatusMessage({
        type: 'error',
        message: 'Please connect your wallet to make a purchase.'
      })
      return
    }
    
    if (items.length === 0) {
      setStatusMessage({
        type: 'error',
        message: 'Your cart is empty. Please add items before checking out.'
      })
      return
    }
    
    // Check if user has enough STRK tokens for the purchase
    if (balance) {
      // Parse the total price and balance to numbers for comparison
      const totalPrice = parseFloat(total)
      const userBalance = parseFloat(balance.formatted)
      
      if (userBalance < totalPrice) {
        setStatusMessage({
          type: 'error',
          message: `Insufficient funds: You need ${formatStrkPriceNatural(total)} but only have ${formatStrkPriceNatural(balance.formatted)} STRK.`
        })
        return
      }
    }

    setIsSubmitting(true)

    try {
      // Convert cart items to PurchaseItem structs for the contract
      const purchases = items.map(item => ({
        product_id: Number(item.id), // Convert string ID to number
        quantity: item.quantity
      }))

      console.log("Preparing buy_product transaction with:", purchases)
      
      // Check if contract has buy_product function
      if (contract && contract.functions && typeof contract.functions.buy_product === 'function') {
        // Prepare the buy_product transaction
        const calls = contract.populate("buy_product", [purchases])

        if (calls) {
          // Show processing message
          setStatusMessage({
            type: 'info',
            message: 'Please confirm the transaction in your wallet...'
          })
          
          // Execute the transaction
          console.log("Sending transaction with calls:", calls)
          const response = await sendAsync([calls])
          console.log("Transaction response:", response)
          
          // Store the transaction hash to monitor its status
          if (response.transaction_hash) {
            setTransactionHash(response.transaction_hash)
            
            setStatusMessage({
              type: 'info',
              message: `Transaction submitted: ${response.transaction_hash.substring(0, 10)}...`
            })
          }
        } else {
          throw new Error("Failed to prepare transaction calls")
        }
      } else {
        console.error("Contract or buy_product function not found")
        throw new Error("Contract method 'buy_product' not available")
      }
    } catch (error) {
      console.error("Error processing purchase:", error)
      
      // Provide more specific error messages based on the error type
      let errorMessage = "There was an error processing your purchase. Please try again."
      
      if (error instanceof Error) {
        const errorStr = String(error);
        
        if (errorStr.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to complete your purchase."
        } else if (errorStr.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (errorStr.includes("u256_sub Overflow") || errorStr.includes("Overflow")) {
          errorMessage = "Insufficient STRK tokens in your wallet. Please add funds to complete this purchase."
        } else {
          // Include the actual error message for debugging
          errorMessage = `Error: ${errorStr}`
        }
      }
      
      setStatusMessage({
        type: 'error',
        message: errorMessage
      })
      
      setIsSubmitting(false)
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatusMessage(null)
      }, 5000)
    }
  }

  return (
    <div className="space-y-2 w-full">
      {statusMessage && (
        <div className={`p-2 rounded text-sm flex items-center ${
          statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 
          statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {statusMessage.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
          {statusMessage.type === 'success' && <CheckCircle className="h-4 w-4 mr-2" />}
          {statusMessage.type === 'info' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {statusMessage.message}
        </div>
      )}
      
      <Button 
        className="w-full" 
        onClick={handleCheckout} 
        disabled={isSubmitting || isWaitingForReceipt || items.length === 0}
      >
        {isSubmitting || isWaitingForReceipt ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isWaitingForReceipt ? "Processing..." : "Submitting..."}
          </>
        ) : (
          "Checkout"
        )}
      </Button>
    </div>
  )
}
