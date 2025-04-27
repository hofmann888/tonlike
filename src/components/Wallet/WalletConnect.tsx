'use client'

import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";
import "@/css/wallet.scss";

export default function WalletConnect() {
  // const { network } = useTonConnect();

  return (
    <div className="flex items-center justify-center">
      {/* <div>
        {network
          ? network === CHAIN.MAINNET
            ? "mainnet"
            : "testnet"
          : ""
        }
      </div> */}

      <TonConnectButton className="ton-connect-button" />
    </div>
  )
}