'use client'

import { User } from "@/lib/definitions";
import { createContext, useEffect, useState } from "react";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export const UserContext = createContext({
  user: {} as User,
  updateUser: (data: any) => {}
});

export default function UserProvider({children, sessionData}: {children: React.ReactNode, sessionData: any}) {
  console.log('UserProvider');

  const [session, setSession] = useState(sessionData); // TODO: pass only user data? not the whole session?

  if (!session?.user) {
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
      if (!result.success) {
        throw new Error('Authentication failed!');
      }
      setSession(result.session);
    })
    .catch(error => {
      throw new Error(`Auth Request ${error}`); // TODO: import ErrorBoundary and other Error shit because this shit not being catched
    });
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
    user: user,
    updateUser: updateUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}