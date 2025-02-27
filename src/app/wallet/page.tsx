'use client'

// import { Tabs, Tab } from "@heroui/tabs";
// import { useTonConnect } from "@/hooks/useTonConnect";
// import DepositForm from "@/components/WalletPage/DepositForm";
// import WithdrawForm from "@/components/WalletPage/WithdrawForm";
// import WalletConnect from "@/components/WalletPage/WalletConnect";
import { tgOpenLink } from '@/utils/helpers';
import { Button } from "@heroui/button";
import Image from 'next/image';

export default function WalletPage() {
  // const { connected } = useTonConnect();
  const link = 'https://t.me/tonlike_app';

  return (
    <div className="py-5 px-2 h-full">
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-center text-4xl font-black text-primary">COMING SOON</p>
        <p className="text-center text-large font-bold mt-3">STAY TUNED...</p>
      </div>

      <div className="sticky bottom-28 w-full text-center">
        <Button 
          size="lg"
          variant="light" 
          aria-label="Telegram"
          startContent={<Image width={30} height={30} src="/img/social/telegram.png" alt="telegram" />}
          onPress={() => tgOpenLink(link)}
        >
          Subscribe
        </Button>
      </div>
    </div>
  )

  // if (!connected) return (
  //   <div className="wallet-page">
  //     <WalletConnect />
  //   </div>
  // );

  // return (
  //   <div className="wallet-page">
  //     <Tabs
  //       color="primary"
  //       variant="underlined"
  //       radius="none"
  //       classNames={{
  //         base: "w-full mb-3",
  //         cursor: "w-full",
  //         tabList: "w-full p-0 border-b border-divider",
  //         tab: "px-0 h-14 data-[selected=true]:bg-[#ffffff12]",
  //         tabContent: "group-data-[selected=true]:text-foreground-900"
  //         // cursor: "w-full bg-[#22d3ee]",
  //         // tabContent: "group-data-[selected=true]:text-[#06b6d4]",
  //       }}
  //     >
  //       <Tab key="deposit" title="Deposit" className="px-2">
  //         <DepositForm />
  //       </Tab>

  //       <Tab key="withdraw" title="Withdraw" className="px-2">
  //         <WithdrawForm />
  //       </Tab>
  //     </Tabs>
  //   </div>
  // )
}