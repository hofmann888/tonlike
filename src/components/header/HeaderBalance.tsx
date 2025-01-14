'use client'

import { useUser } from "@/hooks/useUser";
import { PiCoinVertical } from "react-icons/pi";

export default function HeaderBalance() {
  const { balance } = useUser();

  return (
    <div className="header-balance">
      <p className="flex items-center text-large">Balance: <PiCoinVertical />{balance}</p>
    </div>
  );
}