'use client'

import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { createContext, useEffect, useState } from "react";
import { deleteSession } from "@/app/auth/session";
import { authRequest } from "@/utils/api-requests";
import { useRouter } from "next/navigation";
import { User } from "@/lib/definitions";
import LayoutLoader from "../Common/LayoutLoader";


export const UserContext = createContext({
  isAuth: false,
  user: {} as User,
  updateUser: (data: any) => {}
});

export default function UserProvider({
  children, userData
}: {
  children: React.ReactNode, userData: User
}) {
  console.log('UserProvider userData:', userData);
  const router = useRouter();
  const [user, setUser] = useState(userData);
  const [isAuth, setIsAuth] = useState(!!userData?.id);
  const [isPending, setIsPending] = useState(false); // TODO?: useTransition (error: can't use while render...)
  const { initData, initDataRaw } = retrieveLaunchParams(); // TODO: TypedError: Unable to retrieve launch parameters from any known source. Perhaps, you have opened your app outside Telegram?
  
  if (isAuth && user?.tgId !== initData?.user?.id) {
    deleteSession();
    setIsAuth(false);
  }

  if (!isAuth && !isPending) {
    makeAuthRequest();
  }

  const value = {
    isAuth: isAuth,
    user: user,
    updateUser: updateUser
  };

  useEffect(() => {
    updateUser(userData);
  }, [userData]);

  useEffect(() => {
    if (isAuth) {
      router.refresh();
    }
  }, [isAuth]);

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

  console.log('UserProvider user:', user);  

  return !isAuth
    ? <LayoutLoader />
    : 
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
}