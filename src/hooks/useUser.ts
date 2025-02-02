import { useContext } from "react";
import { UserContext } from "@/components/Providers/UserProvider";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export function useUser() {
  console.log('useUser');
  const { user, updateUser } = useContext(UserContext);
  const { initData } = retrieveLaunchParams();

  return {
    id: user?.id,
    // address: user?.address,
    reffererId: user?.referrerId,
    balance: user?.balance,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
    tgId: initData?.user?.id,
    tgUserName: initData?.user?.username,
    tgFirstName: initData?.user?.firstName,
    tgLastName: initData?.user?.lastName,
    tgPhotoUrl: initData?.user?.photoUrl,
    tgLanguageCode: initData?.user?.languageCode,
    tgAllowsWriteToPm: initData?.user?.allowsWriteToPm,

    updateUser: updateUser,
  }
}