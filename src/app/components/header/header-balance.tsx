'use client'

import { useConnectedUser } from "@/app/hooks/useConnectedUser";
import { UserContext } from "../providers/user-provider";
import { useContext } from "react";
import { User } from "@/app/lib/definitions";

export default function HeaderBalance() {
  const { user } = useContext(UserContext);

  // const user = useContext(UserContext) as User;

  // function test() {
  //   console.log(user);
  //   user.balance = user.balance + 1;
  //   // user.update({balance: user.balance + 1});
  // }

  return (
    <div className="header-balance">
      <p>Balance: {user.balance}</p>
      <p>Reward: {user.reward}</p>
    </div>
  );
}