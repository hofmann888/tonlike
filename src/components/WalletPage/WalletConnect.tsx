'use client'

import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

export default function WalletConnect() {
  const { network } = useTonConnect();
  
  return (
    <div className="flex items-center justify-end my-5">
      <div>
      {network
        ? network === CHAIN.MAINNET
          ? "mainnet"
          : "testnet"
        : ""}
      </div>

      <TonConnectButton />
    </div>
  )
}