"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trophy } from "lucide-react"
import { IPFSUpload, type IPFSUploadRef } from "@/components/ipfs-upload"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"

interface RewardTier {
  id: string
  name: string
  description: string
  requiredThreshold: number
  imageUrl: string
}

interface EditRewardTierModalProps {
  isOpen: boolean
  onClose: () => void
  rewardTier: RewardTier | null
  onSuccess: () => void
}

export function EditRewardTierModal({ isOpen, onClose, rewardTier, onSuccess }: EditRewardTierModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requiredThreshold: "",
    image: "",
  })
  const [transactionHash, setTransactionHash] = useState<string>("")
  const ipfsUploadRef = useRef<IPFSUploadRef>(null)

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

  // Effect to populate form data when reward tier changes
  useEffect(() => {
    if (rewardTier) {
      setFormData({
        name: rewardTier.name,
        description: rewardTier.description,
        requiredThreshold: String(rewardTier.requiredThreshold),
        image: rewardTier.imageUrl,
      })
    }
  }, [rewardTier])

  // Effect to handle successful transaction receipt
  useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed
      toast({
        title: "Reward tier updated successfully",
        description: "Your reward tier has been updated.",
      })

      // Reset transaction hash
      setTransactionHash("")
      
      // Close modal and trigger refresh
      onSuccess()
      onClose()
    }
  }, [receipt, transactionHash, onSuccess, onClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (fileUrl: string) => {
    setFormData((prev) => ({ ...prev, image: fileUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.requiredThreshold) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Check if we have a file to upload or if we're keeping the existing image
      let ipfsUrl = formData.image
      
      // If a new file was selected, upload it to IPFS
      if (ipfsUploadRef.current?.hasFile() && !ipfsUrl.startsWith('ipfs://') && !ipfsUrl.includes('/ipfs/')) {
        try {
          ipfsUrl = await ipfsUploadRef.current.uploadToIPFS()
          console.log("Uploaded to IPFS:", ipfsUrl)
        } catch (error) {
          console.error("Error uploading to IPFS:", error)
          toast({
            title: "Image upload failed",
            description: "Failed to upload image to IPFS. Please try again.",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      if (!rewardTier || !rewardTier.id) {
        throw new Error("No reward tier ID provided for update");
      }

      // Convert values to appropriate types for Cairo contract
      const nameAsFelt = shortString.encodeShortString(formData.name);
      const requiredThresholdAsU32 = Math.floor(Number(formData.requiredThreshold)); // Ensure it's an integer
      const tierId = rewardTier.id;
      
      // For ByteArray values (description and image), we just pass the strings directly
      const description = formData.description;
      
      console.log("Preparing update_reward_tier transaction with:", {
        id: tierId,
        name: nameAsFelt,
        requiredThreshold: requiredThresholdAsU32,
        description: description,
        image: ipfsUrl
      });
      
      // Check if contract has update_reward_tier function
      if (contract && contract.functions && contract.functions.update_reward_tier) {
        // Prepare the update_reward_tier transaction
        const calls = contract.populate("update_reward_tier", [
          tierId,
          nameAsFelt,
          requiredThresholdAsU32,
          description,
          ipfsUrl
        ]);

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
        // If the contract doesn't have the update_reward_tier function yet
        toast({
          title: "Contract function not available",
          description: "The update_reward_tier function is not available in the contract. This feature may not be implemented yet.",
          variant: "destructive",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error updating reward tier:", error);
      
      let errorMessage = "There was an error updating the reward tier. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to update the reward tier.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error updating reward tier",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Edit Reward Tier
            </DialogTitle>
            <DialogDescription>
              Update the details of this reward tier.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Reward Name</Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Gold Member"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Exclusive benefits for our gold tier members"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-requiredThreshold">Required Points</Label>
              <Input
                id="edit-requiredThreshold"
                name="requiredThreshold"
                type="number"
                min="1"
                placeholder="1000"
                value={formData.requiredThreshold}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <IPFSUpload 
                ref={ipfsUploadRef}
                onChange={handleImageChange} 
                value={formData.image}
                showIPFSInfo={true}
              />
              <p className="text-xs text-muted-foreground">
                This image will be used as the NFT for this reward tier.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
