'use client'

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { createContext, useEffect, useState } from "react";
import { deleteSession } from "@/app/auth/session";
import { authRequest } from "@/utils/api-requests";
import { User } from "@/lib/definitions";
import LayoutLoader from "../Common/LayoutLoader";

export const UserContext = createContext({
  isAuth: false,
  user: {} as User,
  updateUser: (data: any) => {}
});

export default function UserProvider({children, userData}: {children: React.ReactNode, userData: User}) {
  console.log('UserProvider userData:', userData);
  const { initData, initDataRaw } = retrieveLaunchParams(); // TODO: TypedError: Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?
  const [isPending, setIsPending] = useState(false); // TODO?: useTransition (error: can't use while render...)
  const [isAuth, setIsAuth] = useState(!!userData?.id);
  const [user, setUser] = useState(userData);
  
  function updateUser(data: any) {
    setUser(Object.assign({}, user, data));
  }

  async function makeAuthRequest() {
    setIsPending(true);
    const result: any = await authRequest(initDataRaw);
    if (!result.success || !result.session?.user?.id) {
      throw new Error('Authentication failed!');
    }
    setUser(result.session.user);
    setIsAuth(true);
    setIsPending(false);
  }

  useEffect(() => {
    updateUser(userData);
  }, [userData]);

  if (isAuth && user?.tgId !== initData?.user?.id) {
    deleteSession();
    setIsAuth(false);
  }

  if (!isAuth && !isPending) {
    makeAuthRequest();
  }

  console.log('UserProvider user:', user);  

  const value = {
    isAuth: isAuth,
    user: user,
    updateUser: updateUser
  };

  return !isAuth
    ? <LayoutLoader />
    : 
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
}