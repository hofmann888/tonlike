'use client'

import DepositForm from "@/components/WalletPage/DepositForm";
import WithdrawForm from "@/components/WalletPage/WithdrawForm";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { useTonConnect } from "@/hooks/useTonConnect";
import "@/css/wallet.scss";

export default function Walletage() {
  const { connected } = useTonConnect();

  if (!connected) return (<div className="wallet-page">Connect wallet!</div>);

  return (
    <div className="wallet-page">
      <Tabs>
        <TabList>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>

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