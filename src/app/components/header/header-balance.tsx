'use client'

// import { useConnectedUser } from "@/app/hooks/useConnectedUser";
// import { User } from "@/app/lib/definitions";
import { UserContext } from "../providers/user-provider";
import { useContext } from "react";

export default function HeaderBalance() {
  // const { balance, reward } = useConnectedUser();
  const { balance, reward } = useContext(UserContext);

  return (
    <div className="header-balance">
      <p>Balance: {balance}</p>
      <p>Reward: {reward}</p>
    </div>
  );
}