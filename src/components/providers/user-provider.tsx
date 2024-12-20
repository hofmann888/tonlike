'use client'

import { User } from "@/lib/definitions";
import { createContext } from "react";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";

export const UserContext = createContext({
  id: 0,
  address: '',
  balance: 0,
  reward: 0,
  updateUser: (data: any) => {}
});

export default function UserProvider({children, session}: {children: React.ReactNode, session: any}) {
  console.log('UserProvider');

  if (!session?.user) {
    session = useSession();
    console.log('UserProvider useSession:'); console.log(session);
  }
  
  const connectedUser: User = session?.user;
  const [user, setUser] = useState(connectedUser);
  
  function updateUser(data: any) {
    setUser(Object.assign({}, user, data));
  }

  useEffect(() => {
    if (session?.user) {
      updateUser(session.user);
    }
  }, [session]);

  const value = {
    id: user?.id, 
    address: user?.address, 
    balance: user?.balance,
    reward: user?.reward,
    updateUser: updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}