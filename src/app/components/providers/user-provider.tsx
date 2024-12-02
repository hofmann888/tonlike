'use client'

import { createContext } from "react";
import { useConnectedUser } from "@/app/hooks/useConnectedUser";
import { useState } from "react";
import { User } from "@/app/lib/definitions";

export const UserContext = createContext({
  id: 0,
  address: '',
  balance: 0,
  reward: 0,
  updateUser: (data: any) => {}
});

export default function UserProvider({children}: {children: React.ReactNode}) {
  const connectedUser = useConnectedUser() as User;
  const [user, setUser] = useState(connectedUser);
  
  function updateUser(data: any) {
    setUser(Object.assign({}, user, data));
  }

  const value = {
    id: user.id, 
    address: user.address, 
    balance: user.balance,
    reward: user.reward,
    updateUser: updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}