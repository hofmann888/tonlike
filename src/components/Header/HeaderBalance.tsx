'use client'

import { useUser } from "@/hooks/useUser";
import CoinValue from "../Common/CoinValue";

export default function HeaderBalance() {
  const { balance } = useUser();

  return (
    <div className="flex flex-col justify-center">
      <CoinValue value={balance} textBefore="Balance:" className="text-large" />
    </div>
  );
}