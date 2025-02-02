'use client'

import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

export default function HeaderWallet() {
  const { network } = useTonConnect();
  
  return (
    <div className="header-wallet">
      <TonConnectButton />

      <div>
      {network
        ? network === CHAIN.MAINNET
          ? "mainnet"
          : "testnet"
        : "N/A"}
      </div>
    </div>
  )
}