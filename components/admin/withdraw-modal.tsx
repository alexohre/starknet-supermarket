"use client"

import type React from "react"

import { useState } from "react"
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

interface WithdrawModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance: string
  walletAddress: string
}

export function WithdrawModal({ open, onOpenChange, availableBalance, walletAddress }: WithdrawModalProps) {
  const [amount, setAmount] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate amount
    const withdrawAmount = Number.parseFloat(amount)
    const availableAmount = Number.parseFloat(availableBalance)

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    if (withdrawAmount > availableAmount) {
      toast({
        title: "Insufficient funds",
        description: "You cannot withdraw more than your available balance.",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawing(true)

    try {
      // In a real app, you would call the Starknet contract to withdraw funds
      // Simulate a transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal successful",
        description: `${amount} STRK has been sent to your wallet.`,
      })

      setAmount("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(availableBalance)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Revenue</DialogTitle>
          <DialogDescription>Withdraw your store revenue to your connected wallet.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleWithdraw} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount (STRK)</Label>
              <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={handleMaxClick}>
                Max
              </Button>
            </div>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0.000001"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
            <p className="text-xs text-muted-foreground">Available balance: {availableBalance} STRK</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Recipient Wallet</Label>
            <Input id="wallet" value={walletAddress} readOnly className="bg-muted" />
          </div>

          <div className="bg-muted p-3 rounded-md flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              Withdrawals are final and cannot be reversed. Please ensure the recipient wallet address is correct.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isWithdrawing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isWithdrawing}>
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Withdraw Funds"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
