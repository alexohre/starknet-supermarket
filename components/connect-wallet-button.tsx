"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

export function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [network, setNetwork] = useState("Sepolia")
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const connectWallet = async () => {
    try {
      // This is a placeholder for actual Starknet wallet connection
      // In a real app, you would use a library like starknet.js or get-starknet
      console.log("Connecting to wallet...")

      // Simulate successful connection
      setTimeout(() => {
        const mockAddress = "0x" + Math.random().toString(16).slice(2, 12)
        const mockBalance = (Math.random() * 10).toFixed(4)
        setWalletAddress(mockAddress)
        setBalance(mockBalance)
        // Randomly select network for demo
        setNetwork(Math.random() > 0.5 ? "Mainnet" : "Sepolia")
        setIsConnected(true)
        setIsOpen(false)
      }, 1000)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
    setBalance("0")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          size={isMobile ? "icon" : "default"}
        >
          {isConnected ? (
            isMobile ? (
              <Wallet className="h-4 w-4" />
            ) : (
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start text-xs">
                  <div className="flex items-center gap-1">
                    <span>
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                      {network}
                    </Badge>
                  </div>
                  <span>{balance} STRK</span>
                </div>
              </div>
            )
          ) : isMobile ? (
            <Wallet className="h-4 w-4" />
          ) : (
            <span className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect your wallet</DialogTitle>
          <DialogDescription>Connect your Starknet wallet to access the supermarket.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="mb-1">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
                <p className="text-sm text-muted-foreground">Balance: {balance} STRK</p>
                <Badge className="mt-2">{network}</Badge>
              </div>
              <Button variant="destructive" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <Button onClick={connectWallet} className="w-full">
                Connect with ArgentX
              </Button>
              <Button onClick={connectWallet} className="w-full">
                Connect with Braavos
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
