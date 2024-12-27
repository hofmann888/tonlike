'use client'

import { User } from "@/lib/definitions";
import { createContext, useEffect, useState } from "react";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

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

  useEffect(() => {
    updateUser(userData);
  }, [userData]);

  if (!user) {
    const { initDataRaw } = retrieveLaunchParams();
    fetch('/auth', {
      method: 'POST',
      headers: { Authorization: `${initDataRaw}` },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      console.log("Fetched auth data:", result);
      if (!result.success || !result.session?.user) {
        throw new Error('Authentication failed!');
      }
      setUser(result.session.user);
    })
    .catch(error => {
      throw new Error(`Auth Request ${error}`);
    });
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