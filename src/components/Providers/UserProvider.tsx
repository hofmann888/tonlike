'use client'

import { User } from "@/lib/definitions";
import { createContext } from "react";
import { useEffect, useState } from "react";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export const UserContext = createContext({
  user: {} as User,
  updateUser: (data: any) => {}
});

export default function UserProvider({children, sessionData}: {children: React.ReactNode, sessionData: any}) {
  console.log('UserProvider');

  const [session, setSession] = useState(sessionData); // TODO: pass only user data? not the whole session?

  if (!session?.user) {
    // const { initDataRaw } = retrieveLaunchParams();
    const initDataRaw = 'query_id=AAGgOwR_AgAAAKA7BH8pd9B2&user=%7B%22id%22%3A6425951136%2C%22first_name%22%3A%22%EF%BE%A0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22phnx888%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FQhwMIgschaSu3qybJbo7KL8mnz4-CD-y8VcKotCK5iDtGbmX6GCuVx7s6s05cYEl.svg%22%7D&auth_date=1734288731&signature=6TJRE7ToLltqVLTr51Zbeg8DD2BUYYyhVj_9PigaqhvMOrClOD5MaHrE6vAaBq_oOZUQz343UB_U8toPgofbDA&hash=bbe44205a58f6b9246318845bf113edc13a8afe1cc115845e59becadc3d81cc0';
    fetch('/init-data/auth', {
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
      throw new Error(`Auth Request ${error}`); // TODO: errors
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