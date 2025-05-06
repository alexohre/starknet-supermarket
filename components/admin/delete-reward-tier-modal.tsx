"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"

interface RewardTier {
  id: string
  name: string
  description: string
  requiredThreshold: number
  imageUrl: string
}

interface DeleteRewardTierModalProps {
  isOpen: boolean
  onClose: () => void
  rewardTier: RewardTier | null
  onSuccess: () => void
}

export function DeleteRewardTierModal({ isOpen, onClose, rewardTier, onSuccess }: DeleteRewardTierModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")

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
      toast({
        title: "Reward tier deleted",
        description: "The reward tier has been successfully removed.",
      })

      // Reset transaction hash
      setTransactionHash("")
      
      // Close modal and trigger refresh
      onSuccess()
      onClose()
    }
  }, [receipt, transactionHash, onSuccess, onClose])

  const handleDelete = async () => {
    if (!rewardTier || !rewardTier.id) return;
    
    setIsDeleting(true);

    try {
      // Check if contract has remove_reward_tier function
      if (contract && contract.functions && contract.functions.remove_reward_tier) {
        // Prepare the remove_reward_tier transaction
        const calls = contract.populate("remove_reward_tier", [rewardTier.id]);

        if (calls) {
          // Execute the transaction
          const response = await sendAsync([calls]);
          
          // Store the transaction hash to monitor its status
          if (response.transaction_hash) {
            setTransactionHash(response.transaction_hash);
          }
        } else {
          throw new Error("Failed to prepare transaction");
        }
      } else {
        // If the contract doesn't have the remove_reward_tier function yet
        toast({
          title: "Contract function not available",
          description: "The remove_reward_tier function is not available in the contract. This feature may not be implemented yet.",
          variant: "destructive",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error deleting reward tier:", error);
      
      let errorMessage = "There was an error deleting the reward tier. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to delete the reward tier.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error deleting reward tier",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Reward Tier
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this reward tier? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {rewardTier && (
          <div className="py-4">
            <p className="font-medium">{rewardTier.name}</p>
            <p className="text-sm text-muted-foreground mt-1">{rewardTier.description}</p>
            <p className="text-sm mt-2">
              <span className="font-medium">Required Threshold:</span> {rewardTier.requiredThreshold} STRK
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Reward Tier"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
