"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useBalance,
  useContract
} from "@starknet-react/core"
import { sepolia } from "@starknet-react/chains"
import { SUPERMARKET_CONTRACT_ADDRESS, formatAddress } from "@/lib/contracts"

// STRK token address on Sepolia
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"

export function ConnectWalletButton() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Get ETH balance
  const { data: ethBalanceData } = useBalance({
    address,
    watch: true,
  })
  
  // Get STRK token balance
  const { data: strkBalanceData } = useBalance({
    address,
    token: STRK_TOKEN_ADDRESS,
    watch: true,
  })
  
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [open, setOpen] = useState(false)
  const [isSpecificWallet, setIsSpecificWallet] = useState(false)
  const [strkBalance, setStrkBalance] = useState("0.0000")
  
  // Check STRK token balance
  useEffect(() => {
    if (isConnected && address && strkBalanceData) {
      // Set the STRK balance rounded to 4 decimal places
      const formattedBalance = Number(strkBalanceData.formatted || 0).toFixed(4)
      setStrkBalance(formattedBalance)
      
      // If they have any STRK tokens, mark them as a specific wallet
      const hasStrkTokens = Number(strkBalanceData.formatted) > 0
      setIsSpecificWallet(hasStrkTokens)
    } else {
      setStrkBalance("0.0000")
      setIsSpecificWallet(false)
    }
  }, [address, isConnected, strkBalanceData])
  
  // Contract integration
  const { contract } = useContract({
    address: SUPERMARKET_CONTRACT_ADDRESS,
    // We don't need to specify the abi here since we're not making any calls yet
  })

  const handleConnectWallet = async (connectorId: string) => {
    try {
      const connector = connectors.find((c) => c.id === connectorId)
      if (connector) {
        await connect({ connector })
        setOpen(false) // Close modal after successful connection
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const handleDisconnectWallet = () => {
    disconnect()
  }

  // Format ETH balance for display
  const formatEthBalance = () => {
    if (!ethBalanceData) return "0"
    return (Number(ethBalanceData.formatted) || 0).toFixed(4)
  }

  const isLoading = isConnecting || isReconnecting

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`border-accent hover:bg-accent hover:text-accent-foreground ${isSpecificWallet ? 'bg-green-100 text-green-800' : 'text-accent'}`}
          size={isMobile ? "icon" : "default"}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isConnected ? (
            isMobile ? (
              <Wallet className="h-4 w-4" />
            ) : (
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start text-xs">
                  <div className="flex items-center gap-1">
                    <span>
                      {formatAddress(address)}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                      {sepolia.name}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <span>{formatEthBalance()} ETH</span>
                    {isSpecificWallet && <span>{strkBalance} STRK</span>}
                  </div>
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
          <DialogDescription>
            Connect your Starknet wallet to access the supermarket.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isConnected ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="mb-1">
                  Connected: {formatAddress(address)}
                </p>
                <p className="text-sm text-muted-foreground">
                  ETH Balance: {formatEthBalance()} ETH
                </p>
                <p className="text-sm text-muted-foreground">
                  STRK Balance: {strkBalance} STRK
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Network: {sepolia.name}
                </p>
                {isSpecificWallet ? (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✓ Has STRK tokens
                  </p>
                ) : (
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    ⚠️ No STRK tokens found
                  </p>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={handleDisconnectWallet}>
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleConnectWallet(connector.id)}
                  disabled={!connector.available()}
                >
                  <img 
                    src={typeof connector.icon === 'string' 
                      ? connector.icon 
                      : connector.icon?.dark}
                    alt={connector.name} 
                    className="h-5 w-5 mr-2" 
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-logo.png"
                    }}
                  />
                  {connector.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
