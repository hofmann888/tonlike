'use client'

import { Chip } from "@heroui/chip";
import { useUser } from "@/hooks/useUser";
import { BsCurrencyDollar } from "react-icons/bs";
import CoinValue from "../Common/CoinValue";

export default function HeaderBalance() {
  const { balance } = useUser();

  return (
    <div>
      <span className="text-lg">Balance:</span>
      <div className="flex flex-row justify-center text-medium">
        <Chip size="md" variant="flat" color="primary" className="mt-1 mr-1">
          <CoinValue value={balance} />
        </Chip>
        <Chip size="md" variant="flat" color="primary" className="mt-1">
          <div className="flex items-center">
            <BsCurrencyDollar className="inline-block" />0
          </div>
        </Chip>
      </div>
    </div> 
  );
}