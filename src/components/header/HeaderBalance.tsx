'use client'

import { useUser } from "@/hooks/useUser";

export default function HeaderBalance() {
  const { balance, reward } = useUser();

  return (
    <div className="header-balance">
      <p>Balance: {balance}</p>
      <p>Reward: {reward}</p>
    </div>
  );
}