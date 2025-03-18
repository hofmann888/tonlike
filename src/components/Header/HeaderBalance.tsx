'use client'

import { Chip } from "@heroui/chip";
import { useUser } from "@/hooks/useUser";
import { useTranslations } from "next-intl";
import { BsCurrencyDollar } from "react-icons/bs";
import HeaderBalanceChipsSkeleton from "@/components/Skeletons/HeaderBalanceChipsSkeleton";
import CoinValue from "@/components/Common/CoinValue";

export default function HeaderBalance() {
  const { balance } = useUser();
  const t = useTranslations('components.HeaderBalance');

  return (
    <div>
      <span className="text-large">{t('balance')}:</span>
      {balance === undefined
        ? <HeaderBalanceChipsSkeleton />
        : 
          <div className="flex flex-row justify-center text-medium mt-1">
            <Chip size="md" variant="flat" color="primary" className="mr-1">
              <CoinValue value={balance ?? 0} />
            </Chip>
            <Chip size="md" variant="flat" color="primary">
              <div className="flex items-center">
                <BsCurrencyDollar className="inline-block" />0
              </div>
            </Chip>
          </div> 
      }
    </div> 
  )
}