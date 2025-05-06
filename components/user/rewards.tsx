"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Trophy, Check, AlertCircle, Gift } from "lucide-react"
import Image from "next/image"
import { useAccount, useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { formatStrkPrice } from "@/lib/utils"
import Confetti from "react-confetti"

interface RewardTier {
  id: string
  name: string
  description: string
  requiredThreshold: number
  imageUrl: string
}

interface EligibilityResult {
  isEligible: boolean
  orderId: string
  orderAmount: number
  rewardTier: RewardTier | null
  message: string
}

export function RewardsPage() {
  const { address } = useAccount()
  const [orderId, setOrderId] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  })

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

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
        title: "NFT minted successfully",
        description: "Your reward NFT has been minted to your wallet.",
      })

      // Reset transaction hash and minting state
      setTransactionHash("")
      setIsMinting(false)
      
      // Reset eligibility result to encourage checking another order
      setEligibilityResult(null)
      setOrderId("")
    }
  }, [receipt, transactionHash])

  const handleCheckEligibility = async () => {
    if (!orderId) {
      toast({
        title: "Order ID required",
        description: "Please enter an order ID to check eligibility.",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)
    setEligibilityResult(null)
    setShowConfetti(false)

    try {
      // In a real implementation, this would call your contract to check eligibility
      // For now, we'll simulate the check with a mock implementation
      
      // Simulate contract call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock eligibility check - in production, this would be a contract call
      const mockCheck = async () => {
        // For demo purposes, make all orders eligible to show the celebration
        // In production, this would be a real check against your contract
        const isEligible = true
        
        // Mock order amount - in production, this would come from the contract
        const orderAmount = 0.015
        
        // Mock reward tier - in production, this would be determined by the contract
        const rewardTier = {
          id: "1",
          name: "Bronze Member",
          description: "Entry level membership with basic benefits",
          requiredThreshold: 0.01,
          imageUrl: "https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/I/m/QuarterHorse.jpg"
        }
        
        // Return the result
        return {
          isEligible,
          orderId,
          orderAmount,
          rewardTier,
          message: isEligible 
            ? `Congratulations! Your order qualifies for the ${rewardTier.name} NFT reward.` 
            : "This order does not qualify for any NFT rewards."
        }
      }
      
      const result = await mockCheck()
      setEligibilityResult(result)
      
      // Show confetti if eligible
      if (result.isEligible) {
        setShowConfetti(true)
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 9000)
      }
    } catch (error) {
      console.error("Error checking eligibility:", error)
      toast({
        title: "Error checking eligibility",
        description: "There was an error checking your eligibility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleMintNFT = async () => {
    if (!eligibilityResult?.isEligible || !eligibilityResult.rewardTier) {
      toast({
        title: "Not eligible",
        description: "You are not eligible to mint this NFT reward.",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)

    try {
      // In a real implementation, this would call your contract to mint the NFT
      // For now, we'll simulate the minting process
      
      // Simulate a successful minting process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "NFT minted successfully",
        description: "Your reward NFT has been minted to your wallet.",
      })
      
      setIsMinting(false)
      setEligibilityResult(null)
      setOrderId("")
      
    } catch (error) {
      console.error("Error minting NFT:", error)
      
      let errorMessage = "There was an error minting your NFT. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes("User rejected")) {
          errorMessage = "Transaction was rejected by the wallet. Please approve the transaction to mint your NFT.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      toast({
        title: "Error minting NFT",
        description: errorMessage,
        variant: "destructive",
      })
      setIsMinting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}
      
      <h1 className="text-3xl font-bold mb-6 text-center">NFT Rewards</h1>
      
      <div className="flex justify-center">
        <div className="max-w-6xl w-full">
          <div className={`grid ${eligibilityResult?.isEligible ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-6`}>
            {/* Check Eligibility Card */}
            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <Trophy className="mr-2 h-6 w-6 text-amber-500" />
                  Check Reward Eligibility
                </CardTitle>
                <CardDescription className="text-lg">
                  Enter your order ID to check if you're eligible for an NFT reward
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-w-xl mx-auto">
                  <div className="space-y-3">
                    <Label htmlFor="order-id" className="text-lg">Order ID</Label>
                    <div className="flex gap-3">
                      <Input
                        id="order-id"
                        placeholder="e.g. ORD-001"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        disabled={isChecking}
                        className="text-lg h-12"
                      />
                      <Button 
                        onClick={handleCheckEligibility} 
                        disabled={isChecking || !orderId}
                        className="h-12 px-6 text-lg"
                      >
                        {isChecking ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check"
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {eligibilityResult && (
                    <Alert variant={eligibilityResult.isEligible ? "default" : "destructive"} className="text-lg p-6">
                      {eligibilityResult.isEligible ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {eligibilityResult.isEligible ? "Eligible for Reward" : "Not Eligible"}
                      </AlertTitle>
                      <AlertDescription>
                        {eligibilityResult.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reward Preview Card */}
            {eligibilityResult?.isEligible && eligibilityResult.rewardTier && (
              <Card className="w-full">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <Gift className="mr-2 h-6 w-6 text-primary" />
                    Your Reward
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Mint this NFT reward to your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 max-w-xl mx-auto">
                    <div className="relative h-80 w-full rounded-md overflow-hidden border">
                      <Image 
                        src={eligibilityResult.rewardTier.imageUrl} 
                        alt={eligibilityResult.rewardTier.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-amber-500" />
                        {eligibilityResult.rewardTier.name}
                      </h3>
                      <p className="text-lg text-muted-foreground mt-2">
                        {eligibilityResult.rewardTier.description}
                      </p>
                      <div className="mt-3">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          Order Amount: {formatStrkPrice(eligibilityResult.orderAmount.toString())}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button 
                    className="w-3/4 h-12 text-lg" 
                    onClick={handleMintNFT}
                    disabled={isMinting}
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Minting NFT...
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Mint NFT Reward
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
