'use client'

import { UpdateUserWalletAddress } from "@/core/server-actions";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "@/hooks/useTonConnect";
// import { CHAIN } from "@tonconnect/ui-react";
import { useEffect } from "react";
import "@/css/wallet.scss";

export default function WalletConnect() {
  const { address } = useTonConnect();

  useEffect(() => {
    async function updateUserAddress() {
      if (address?.length) {
        await UpdateUserWalletAddress(address);
      }
    }
    updateUserAddress();
  }, [address]);

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