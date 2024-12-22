'use client'

import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export default function WalletConnect() {
  const { network } = useTonConnect();
  
  return (
    <div className="wallet-connect">
      <div>
      {network
        ? network === CHAIN.MAINNET
          ? "mainnet"
          : "testnet"
        : "N/A"}
      </div>

      <TonConnectButton />
    </div>
  )
}