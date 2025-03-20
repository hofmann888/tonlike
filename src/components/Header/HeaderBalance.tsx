'use client'

import { useUser } from "@/hooks/useUser";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import HeaderBalanceChipsSkeleton from "@/components/Skeletons/HeaderBalanceChipsSkeleton";
import CoinValue from "@/components/Common/CoinValue";


export default function HeaderBalance() {
  const { balance } = useUser();

  return (
    <div>
      <User
        avatarProps={{
          isBordered: false,
          src: '/img/logo-circle.png',
          className: "w-5 h-5"
        }}
        name={
          <>
            <span className="font-black">TONLIKE</span> 
            <span className="text-foreground-500 text-[0.6rem] ml-1">alpha</span>
          </>
        }
      />

      {balance === undefined
        ? <HeaderBalanceChipsSkeleton />
        : 
          <div className="flex flex-row justify-center text-medium -mt-1">
            <Chip size="md" variant="light" color="primary" className="mr-1 header-balance-chip">
              <CoinValue value={balance ?? 0} />
            </Chip>
            <Chip size="md" variant="light" color="primary" className="header-balance-chip">
              <CoinValue value={0} currency="usdt" />
            </Chip>
          </div> 
      }
    </div> 
  )
}