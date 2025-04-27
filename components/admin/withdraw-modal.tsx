"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle } from "lucide-react"
import { useContract, useSendTransaction } from "@starknet-react/core"
import { SUPERMARKET_CONTRACT_ADDRESS, SUPERMARKET_ABI } from "@/lib/contracts"
import { strkToMilliunits } from "@/lib/utils"
import { uint256 } from "starknet"

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance: string
  walletAddress: string
}

export function WithdrawModal({ open, onOpenChange, availableBalance, walletAddress }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recipientAddress, setRecipientAddress] = useState(walletAddress)

    // Get contract reference
    const { contract } = useContract({
      address: SUPERMARKET_CONTRACT_ADDRESS,
      abi: SUPERMARKET_ABI as any,
    })

  // Use the useSendTransaction hook to call the withdraw_funds function
  const { sendAsync } = useSendTransaction({ calls: [] })

  useEffect(() => {
    setRecipientAddress(walletAddress);
  }, [walletAddress]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate amount
    if (!amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount")
      return
    }

    const withdrawAmount = Number(amount)
    const availableAmount = Number(availableBalance)

    // Check if amount is greater than available balance
    if (withdrawAmount > availableAmount) {
      setError("Withdrawal amount exceeds available balance")
      return
    }

    // Check if amount is greater than 0
    if (withdrawAmount <= 0) {
      setError("Withdrawal amount must be greater than 0")
      return
    }

    try {
      setIsWithdrawing(true)

      // Convert STRK to milliunits for the contract
      const amountInMilliunits = strkToMilliunits(withdrawAmount)
      
      // Convert to uint256 for the contract
      const amountAsUint256 = uint256.bnToUint256(amountInMilliunits.toString())

      // Call the withdraw_funds function on the contract
      const calls = contract?.populate("withdraw_funds", [recipientAddress, amountAsUint256])
      
      // Send the transaction
      if (calls) {
        await sendAsync([calls]);
        // toast success
        toast({
          title: "Withdrawal successful",
          description: `${amount} STRK has been withdrawn to your wallet.`,
        })
      }

      // Reset the form and close the modal
      setAmount("")
      onOpenChange(false)
    } catch (error: any) {
      console.error("Withdrawal error:", error)
      
      // Handle user rejection separately
      if (error.message?.includes("UserRejectedRequestError")) {
        setError("Transaction rejected by user")
      } else {
        setError("Failed to withdraw funds. Please try again.")
      }
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw available funds to your connected wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input 
                id="wallet" 
                value={recipientAddress} 
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-muted" 
              />
              <p className="text-xs text-muted-foreground">
                You can modify this address to withdraw to a different wallet
              </p>
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount (STRK)</Label>
                <span className="text-sm text-muted-foreground">
                  Available: {availableBalance} STRK
                </span>
              </div>
              <Input
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.001"
                min="0"
                max={availableBalance}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 w-full"
                onClick={() => setAmount(availableBalance)}
              >
                Use Max
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isWithdrawing}>
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Withdrawing...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
