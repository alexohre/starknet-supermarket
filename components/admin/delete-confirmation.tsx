"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { toast } from "@/components/ui/use-toast"

interface DeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  itemName: string
  productId?: string
  onSuccess?: () => void
}

export function DeleteConfirmation({ 
  open, 
  onOpenChange, 
  onConfirm, 
  itemName,
  productId,
  onSuccess
}: DeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transactionHash, setTransactionHash] = useState<string>("")

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Use the useSendTransaction hook to call the delete_product function
  const { sendAsync } = useSendTransaction({ calls: [] })
  
  // Get transaction receipt to monitor transaction status
  const { data: receipt, isLoading: isWaitingForReceipt } = useTransactionReceipt({
    hash: transactionHash,
    watch: true,
  })
  
  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed, update UI and close modal
      toast({
        title: "Product deleted",
        description: `${itemName} has been deleted successfully.`,
      })
      
      // Call onSuccess callback to refetch products
      if (onSuccess) {
        onSuccess()
      }
      
      // Reset transaction hash and close modal
      setTransactionHash("")
      onOpenChange(false)
    }
  }, [receipt, transactionHash, itemName, onSuccess, onOpenChange])

  const handleConfirm = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // If we have a product ID, use the contract to delete it
      if (productId && contract) {
        const idAsU32 = Number(productId);
        
        // Prepare the delete_product transaction
        const calls = contract.populate("delete_product", [idAsU32]);
        
        // Send the transaction
        const response = await sendAsync([calls]);
        
        // Store the transaction hash to monitor its status
        if (response.transaction_hash) {
          setTransactionHash(response.transaction_hash)
        }
        
        // Don't update UI or close modal yet - wait for transaction receipt
      } else {
        // Use the provided onConfirm callback for non-product deletions
        await onConfirm();
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      
      // Handle user rejection separately
      if (error.message?.includes("UserRejectedRequestError")) {
        setError("Transaction rejected by user");
      } else {
        setError("Failed to delete. Please try again.");
        // Keep the dialog open to show the error
        return;
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <span className="font-medium">{itemName}</span> from your store. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mt-2">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting || isWaitingForReceipt}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting || isWaitingForReceipt}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
