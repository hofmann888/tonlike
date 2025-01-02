'use client'

import { Tabs, Tab } from "@nextui-org/tabs";
import { useTonConnect } from "@/hooks/useTonConnect";
import DepositForm from "@/components/WalletPage/DepositForm";
import WithdrawForm from "@/components/WalletPage/WithdrawForm";
import WalletConnect from "@/components/WalletPage/WalletConnect";

export default function Walletage() {
  const { connected } = useTonConnect();

  if (!connected) return (
    <div className="wallet-page">
      <WalletConnect />
    </div>
  );

  return (
    <div className="wallet-page">
      <Tabs
        aria-label="Status"
        // variant="underlined"
        classNames={{
          base: "w-full mb-5",
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          // cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-full px-0 h-12",
          // tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab key="deposit" title="Deposit">
          <DepositForm />
        </Tab>

        <Tab key="withdraw" title="Withdraw">
          <WithdrawForm />
        </Tab>
      </Tabs>
    </div>
  )
}