'use client'

import DepositForm from "@/components/wallet-page/deposit-form";
import WithdrawForm from "@/components/wallet-page/withdraw-form";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "@/css/wallet.scss";

import { useTonConnect } from "@/hooks/useTonConnect";

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