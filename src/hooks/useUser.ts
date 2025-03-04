import { UserContext } from "@/components/Providers/UserProvider";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { useContext } from "react";

export function useUser() {
  const { user, updateUser, isAuth } = useContext(UserContext);
  const { initData } = retrieveLaunchParams();

  return {
    id: user?.id,
    reffererId: user?.referrerId,
    balance: user?.balance,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
    tgId: initData?.user?.id,
    tgUsername: initData?.user?.username,
    tgFirstName: initData?.user?.firstName,
    tgLastName: initData?.user?.lastName,
    tgPhotoUrl: initData?.user?.photoUrl,
    tgLanguageCode: initData?.user?.languageCode,
    tgAllowsWriteToPm: initData?.user?.allowsWriteToPm,

    isAuth: isAuth,
    updateUser: updateUser,
  }
}