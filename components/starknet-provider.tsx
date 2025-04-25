"use client"

import { sepolia } from "@starknet-react/chains"
import {
  StarknetConfig,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  publicProvider
} from "@starknet-react/core"
import type { ReactNode } from "react"

interface StarknetProviderProps {
  children: ReactNode
}

export function StarknetProvider({ children }: StarknetProviderProps) {
  const { connectors } = useInjectedConnectors({
    // Recommended wallets
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors
    order: "random"
  })

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}
