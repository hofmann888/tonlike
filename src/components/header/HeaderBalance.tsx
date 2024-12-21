'use client'

import { UserContext } from "../Providers/UserProvider";
import { useContext } from "react";

export default function HeaderBalance() {
  const { balance, reward } = useContext(UserContext);

  return (
    <div className="header-balance">
      <p>Balance: {balance}</p>
      <p>Reward: {reward}</p>
    </div>
  );
}