'use client'

import { useUser } from "@/hooks/useUser";

export default function HeaderBalance() {
  const { balance, reward } = useUser();

  return (
    <div className="header-balance">
      <p className="text-large">Balance: ${balance}</p>
      <p className="text-large">Reward: {reward}</p>
    </div>
  );
}