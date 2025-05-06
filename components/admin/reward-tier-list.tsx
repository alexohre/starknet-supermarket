"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Trophy, Trash2, ExternalLink, Pencil } from "lucide-react"
import Image from "next/image"
import { useContract, useReadContract } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { EditRewardTierModal } from "@/components/admin/edit-reward-tier-modal"
import { DeleteRewardTierModal } from "@/components/admin/delete-reward-tier-modal"

interface RewardTier {
  id: string
  name: string
  description: string
  requiredThreshold: number
  imageUrl: string
}

export function RewardTierList() {
  const [rewardTiers, setRewardTiers] = useState<RewardTier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTier, setEditingTier] = useState<RewardTier | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingTier, setDeletingTier] = useState<RewardTier | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Get contract reference
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
  })

  // Read reward tiers from contract
  const { data: rewardTiersData, isLoading: isLoadingTiers, refetch } = useReadContract({
    functionName: "get_reward_tiers",
    args: [],
    address: SUPERMARKET_CONTRACT_ADDRESS,
    abi: SUPERMARKET_ABI as any,
    watch: true,
  })

  // Process reward tiers data when it's available
  useEffect(() => {
    if (rewardTiersData) {
      try {
        // This is a placeholder for processing the contract data
        // The actual implementation will depend on your contract's return format
        const processedTiers = Array.isArray(rewardTiersData) 
          ? rewardTiersData.map((tier: any, index: number) => ({
              id: String(index),
              name: tier.name || `Tier ${index + 1}`,
              description: tier.description || "",
              requiredThreshold: Number(tier.required_threshold || 0),
              imageUrl: tier.image_url || "/placeholder-nft.png"
            }))
          : [];
        
        setRewardTiers(processedTiers);
      } catch (error) {
        console.error("Error processing reward tiers:", error);
        toast({
          title: "Error loading reward tiers",
          description: "Failed to load reward tiers from the contract.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [rewardTiersData]);

  // For demo purposes, add some mock data if no tiers are available
  useEffect(() => {
    // Only add mock data if the contract data has been attempted to be loaded
    if (!isLoadingTiers && rewardTiers.length === 0) {
      setRewardTiers([
        {
          id: "1",
          name: "Bronze Member",
          description: "Entry level membership with basic benefits",
          requiredThreshold: 0.001,
          imageUrl: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/I/m/QuarterHorse.jpg"
        },
        {
          id: "2",
          name: "Silver Member",
          description: "Mid-tier membership with enhanced benefits",
          requiredThreshold: 0.005,
          imageUrl: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/I/m/Oryx.jpg"
        },
        {
          id: "3",
          name: "Gold Member",
          description: "Premium membership with exclusive benefits",
          requiredThreshold: 0.01,
          imageUrl: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/I/m/Addax.jpg"
        }
      ]);
      setIsLoading(false);
    }
  }, [isLoadingTiers, rewardTiers.length]);

  const handleEditClick = (tier: RewardTier) => {
    setEditingTier(tier);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (tier: RewardTier) => {
    setDeletingTier(tier);
    setIsDeleteModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    toast({
      title: "Reward tier updated",
      description: "The reward tier has been successfully updated.",
    });
  };

  const handleDeleteSuccess = () => {
    refetch();
    toast({
      title: "Reward tier deleted",
      description: "The reward tier has been successfully deleted.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reward Tiers</CardTitle>
          <CardDescription>Manage NFT reward tiers for your loyalty program.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rewardTiers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NFT Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Required Threshold</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardTiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image 
                          src={tier.imageUrl} 
                          alt={tier.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        {tier.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{tier.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tier.requiredThreshold} STRK</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(tier)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={tier.imageUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View NFT</span>
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => handleDeleteClick(tier)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No reward tiers found</h3>
              <p className="text-muted-foreground">
                Create your first reward tier to start your loyalty program.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <EditRewardTierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        rewardTier={editingTier}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRewardTierModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        rewardTier={deletingTier}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
