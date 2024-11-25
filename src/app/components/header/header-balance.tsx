'use client'

import { useConnectedUser } from "@/app/hooks/useConnectedUser";

export default function HeaderBalance() {
  const { balance, reward } = useConnectedUser();

  return (
    <div className="header-balance">
      <p>Balance: {balance}</p>
      <p>Reward: {reward}</p>
    </div>
  );
}