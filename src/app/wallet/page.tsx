'use client'

import { Tabs, Tab } from "@heroui/tabs";
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
        color="primary"
        variant="underlined"
        radius="none"
        classNames={{
          base: "w-full mb-3",
          cursor: "w-full",
          tabList: "w-full p-0 border-b border-divider",
          tab: "px-0 h-14 data-[selected=true]:bg-[#ffffff12]",
          tabContent: "group-data-[selected=true]:text-foreground-900"
          // cursor: "w-full bg-[#22d3ee]",
          // tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab key="deposit" title="Deposit" className="px-2">
          <DepositForm />
        </Tab>

        <Tab key="withdraw" title="Withdraw" className="px-2">
          <WithdrawForm />
        </Tab>
      </Tabs>
    </div>
  )
}