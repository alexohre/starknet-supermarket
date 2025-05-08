"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trophy } from "lucide-react"
import { IPFSUpload, type IPFSUploadRef } from "@/components/ipfs-upload"
import { useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { shortString } from "starknet"

export function RewardTierForm() {
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

  // Effect to handle successful transaction receipt
  React.useEffect(() => {
    if (receipt && transactionHash) {
      // Transaction is confirmed
      toast({
        title: "Reward tier added successfully",
        description: "Your reward tier has been added to the store.",
      })

      // Reset transaction hash
      setTransactionHash("")

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        requiredThreshold: "",
        image: "",
      })
    }
  }, [receipt, transactionHash])

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

      // Check if we have a file to upload
      if (!ipfsUploadRef.current?.hasFile()) {
        toast({
          title: "Missing reward image",
          description: "Please select an image for the reward NFT.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Upload the image to IPFS with metadata
      let ipfsUrl
      try {
        // Include only name and description with the image upload
        ipfsUrl = await ipfsUploadRef.current.uploadToIPFS({
          name: formData.name,
          description: formData.description
        })
        console.log("Uploaded to IPFS with metadata:", ipfsUrl)
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

      // Convert values to appropriate types for Cairo contract
      const nameAsFelt = shortString.encodeShortString(formData.name);
      const requiredThresholdAsU32 = Math.floor(Number(formData.requiredThreshold) * 1000000); // Ensure it's an integer in wei
      
      // For ByteArray values (description and image), we just pass the strings directly
      const description = formData.description;
      
      console.log("Preparing add_reward_tier transaction with:", {
        name: nameAsFelt,
        requiredThreshold: requiredThresholdAsU32,
        description: description,
        image: ipfsUrl
      });
      
      // Check if contract has add_reward_tier function
      if (contract && contract.functions && typeof contract.functions.add_reward_tier === 'function') {
        // Prepare the add_reward_tier transaction
        const calls = contract.populate("add_reward_tier", [
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
        // If the contract doesn't have the add_reward_tier function yet
        toast({
          title: "Contract function not available",
          description: "The add_reward_tier function is not available in the contract. This feature may not be implemented yet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding reward tier:", error);
      
      let errorMessage = "There was an error adding the reward tier. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to add the reward tier.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error adding reward tier",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Reward Tier</CardTitle>
        <CardDescription>Create a new NFT reward tier for loyal customers.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Reward Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Gold Member"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Exclusive benefits for our gold tier members"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requiredThreshold">Required STRK Threshold</Label>
            <Input
              id="requiredThreshold"
              name="requiredThreshold"
              type="number"
              min="0.0001"
              step="0.0001"
              placeholder="0.005"
              value={formData.requiredThreshold}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum amount of STRK a user must spend to earn this reward.
            </p>
          </div>

          <div className="space-y-2">
            <IPFSUpload 
              ref={ipfsUploadRef}
              onChange={handleImageChange} 
              value={formData.image}
              showIPFSInfo={true}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This image will be used as the NFT for this reward tier.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Reward Tier...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Add Reward Tier
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
