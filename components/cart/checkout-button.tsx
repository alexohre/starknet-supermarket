"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { useContract, useSendTransaction, useTransactionReceipt, useBalance, useAccount } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { strkToMilliunits, formatStrkPriceNatural } from "@/lib/utils"
import { Contract, uint256 } from "starknet"
import toast from "react-hot-toast"

// Define type for purchase items
interface PurchaseItem {
  product_id: number;
  quantity: number;
}

// STRK token address on Starknet
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// Cairo 1.0 ERC20 ABI for token approval
const ERC20_ABI = [
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "type": "core::bool"
      }
    ],
    "state_mutability": "external"
  }
];


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
  
  // Helper function to calculate required token amount
  const calculateRequiredTokenAmount = async (purchases: PurchaseItem[]) => {
    if (!contract || !contract.functions) return null;
    
    try {
      console.log("Contract functions:", Object.keys(contract.functions));
      console.log("Attempting to call calculate_token_amount with:", purchases);
      
      try {
        // First try to call the contract's calculate_token_amount function
        const result = await contract.call("calculate_token_amount", [purchases]);
        console.log("Contract calculated token amount:", result);
        
        // Convert the BigInt to a string and add 10% buffer
        const amount = typeof result === 'bigint' ? result : 
                      result.token_amount ? BigInt(result.token_amount.toString()) : 
                      BigInt(5); // Fallback value
        
        console.log("Contract calculated amount in milliunits:", amount.toString());
        
        // Also calculate based on frontend total for comparison
        const totalPrice = parseFloat(total);
        const totalInMilliunits = strkToMilliunits(totalPrice);
        console.log("Frontend calculated amount in milliunits:", totalInMilliunits.toString());
        
        // Use the higher value to ensure sufficient funds
        const finalMilliunits = BigInt(Math.max(Number(amount), totalInMilliunits));
        console.log("Using the higher amount in milliunits:", finalMilliunits.toString());
        
        // Add 10% buffer
        const amountWithBuffer = finalMilliunits * BigInt(110) / BigInt(100);
        console.log("Amount in milliunits with buffer:", amountWithBuffer.toString());
        
        // For STRK tokens, we need to convert to wei (10^18)
        // Our milliunits are already multiplied by 10^3, so we need to multiply by 10^15 more
        // But we also need to ensure we're working with the actual STRK amount, not just milliunits
        // 1 STRK = 1000 milliunits = 10^18 wei
        const totalInStrk = parseFloat(total);
        const amountInWei = BigInt(Math.ceil(totalInStrk * 1.1 * 10**18));
        console.log("Correct amount in wei (10^18):", amountInWei.toString());
        
        // Return the amount in wei as a string
        return amountInWei.toString();
      } catch (contractError) {
        console.log("Error calling contract function:", contractError);
        console.log("Falling back to manual calculation...");
        
        // Fallback: Calculate based on total price directly in STRK
        const totalPrice = parseFloat(total);
        
        // Add 10% buffer and convert directly to wei (10^18)
        const amountInWei = BigInt(Math.ceil(totalPrice * 1.1 * 10**18));
        console.log("Fallback amount in wei (10^18):", amountInWei.toString());
        
        return amountInWei.toString();
      }
    } catch (error) {
      console.error("Error in token amount calculation:", error);
      return null;
    }
  };

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

      console.log("Preparing transactions for approval and purchase with:", purchases)
      
      // Check if contract is available
      if (contract && contract.functions) {
        // Show processing message for token amount calculation
        setStatusMessage({
          type: 'info',
          message: 'Calculating required token approval...'
        })
        
        // 1. Calculate required token amount using the new helper function
        let requiredAmount = await calculateRequiredTokenAmount(purchases);
        
        if (!requiredAmount) {
          // Fall back to a default approach for token approval
          // Using a higher amount to ensure the transaction succeeds
          const totalPrice = parseFloat(total);
          const amount = BigInt(Math.ceil(totalPrice * 10**18 * 1.1)); // Add 10% buffer
          requiredAmount = amount.toString();
          
          console.log("Using fallback approval amount:", requiredAmount);
          setStatusMessage({
            type: 'info',
            message: 'Using estimated token approval (with 10% buffer)...'
          });
        }
        
        console.log("Required token amount for approval:", requiredAmount);
        
        // 2. Create token contract instance for approval
        const tokenContract = new Contract(
          ERC20_ABI as any,
          STRK_TOKEN_ADDRESS,
          contract.providerOrAccount
        );
        
        // 3. Prepare the approval call
        // For Cairo 1.0 contracts, we pass the amount as a string
        const approveCall = {
          contractAddress: STRK_TOKEN_ADDRESS,
          entrypoint: "approve",
          calldata: [SUPERMARKET_CONTRACT_ADDRESS, requiredAmount, 0]
        };
        
        console.log("Approval call data:", approveCall);
        
        // 4. Prepare the buy_product call
        // The contract expects a structured array of PurchaseItem objects
        // Let's log the purchases to see what we're sending
        console.log("Purchases to send to contract:", JSON.stringify(purchases));
        
        // Create the buy_product call using the contract's populate method
        // This ensures the calldata is properly formatted according to the contract's ABI
        const buyProductCall = contract.populate("buy_product", [purchases]);
        
        // Log the formatted call to see what's being sent
        console.log("Buy product call from populate:", buyProductCall);
        
        // Convert to the format expected by sendAsync
        const formattedBuyProductCall = {
          contractAddress: SUPERMARKET_CONTRACT_ADDRESS,
          entrypoint: "buy_product",
          calldata: buyProductCall.calldata
        };
        
        console.log("Final formatted buy product call:", formattedBuyProductCall);
        
        console.log("Buy product call data:", buyProductCall);
        
        // Make sure requiredAmount is not null before proceeding
        if (requiredAmount) {
          // Show processing message for wallet confirmation
          setStatusMessage({
            type: 'info',
            message: 'Please confirm the transaction in your wallet...'
          });
          
          toast.loading("Processing approval and purchase in one transaction...", {
            duration: 10000,
            position: "top-center"
          });
          
          // 5. Execute both transactions in a multicall
          console.log("Sending multicall transaction with calls:", [approveCall, formattedBuyProductCall]);
          const response = await sendAsync([approveCall, formattedBuyProductCall]);
          console.log("Transaction response:", response);
          
          // Store the transaction hash to monitor its status
          if (response.transaction_hash) {
            setTransactionHash(response.transaction_hash);
            
            toast.success(`Transaction submitted! Hash: ${response.transaction_hash.substring(0, 10)}...`, {
              duration: 5000,
              position: "top-center"
            });
            
            setStatusMessage({
              type: 'info',
              message: `Transaction submitted: ${response.transaction_hash.substring(0, 10)}...`
            });
          }
        } else {
          throw new Error("Failed to prepare transaction calls");
        }
      } else {
        console.error("Contract or required functions not found");
        throw new Error("Contract methods not available");
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
