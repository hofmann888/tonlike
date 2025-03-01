'use client'

import { User } from "@/lib/definitions";
import { authRequest } from "@/utils/api-requests";
import { createContext, useEffect, useState } from "react";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const UserContext = createContext({
  user: {} as User,
  updateUser: (data: any) => {}
});

export default function UserProvider({children, userData}: {children: React.ReactNode, userData: User}) {
  console.log('UserProvider userData:', userData);
  const [user, setUser] = useState(userData);
  
  function updateUser(data: any) {
    setUser(Object.assign({}, user, data));
  }

  async function makeAuthRequest() {
    const { initDataRaw } = retrieveLaunchParams();
    const result: any = await authRequest(initDataRaw);
    if (!result.success || !result.session?.user) {
      throw new Error('Authentication failed!');
    }
    setUser(result.session.user);
  }

  useEffect(() => {
    updateUser(userData);
  }, [userData]);

  if (!user) {
    makeAuthRequest();
  }

  console.log('UserProvider user:', user);  

  const value = {
    user: user,
    updateUser: updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}