'use client'

import { useTonConnect } from "@/hooks/useTonConnect";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DepositForm from "@/components/WalletPage/DepositForm";
import WithdrawForm from "@/components/WalletPage/WithdrawForm";
import WalletConnect from "@/components/WalletPage/WalletConnect";
import "@/css/wallet.scss";

export default function Walletage() {
  const { connected } = useTonConnect();

  if (!connected) return (
    <div className="wallet-page">
      <WalletConnect />
    </div>
  );

  return (
    <div className="wallet-page">
      <Tabs>
        <TabList>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>

        <WalletConnect />

        <TabPanel>
          <DepositForm />
        </TabPanel>
        
        <TabPanel>
          <WithdrawForm/>
        </TabPanel>
      </Tabs>
    </div>
  )
}