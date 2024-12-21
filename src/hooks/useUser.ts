import { useContext } from "react";
import { UserContext } from "@/components/Providers/UserProvider";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export function useUser() {
  const { user, updateUser } = useContext(UserContext);

  let initData: any = {};

  if (process.env.NODE_ENV !== 'development') { // TODO: remove on prod
    const { initData } = retrieveLaunchParams();
  } else {
    initData = {
      authDate: '2024-12-15T18:52:11.000Z',
      hash: 'bbe44205a58f6b9246318845bf113edc13a8afe1cc115845e59becadc3d81cc0',
      queryId: 'AAGgOwR_AgAAAKA7BH8pd9B2',
      signature: '6TJRE7ToLltqVLTr51Zbeg8DD2BUYYyhVj_9PigaqhvMOrClOD5MaHrE6vAaBq_oOZUQz343UB_U8toPgofbDA',
      user: {
        allowsWriteToPm: true,
        firstName: 'phnx',
        id: 6425951136,
        languageCode: 'ru',
        lastName: '',
        // photoUrl: 'https://t.me/i/userpic/320/QhwMIgschaSu3qybJbo7KL8mnz4-CD-y8VcKotCK5iDtGbmX6GCuVx7s6s05cYEl.svg',
        // photoUrl: 'https://docs.telegram-mini-apps.com/logo.db0268ac.png',
        photoUrl: '/globe.svg',
        username: 'phnx888'
      }
    }
  }

  return {
    id: user?.id,
    address: user?.address,
    balance: user?.balance,
    reward: user?.reward,
    tgId: initData?.user.id,
    tgUserName: initData?.user.username,
    tgFirstName: initData?.user.firstName,
    tgLastName: initData?.user.lastName,
    tgPhotoUrl: initData?.user.photoUrl,
    tgLanguageCode: initData?.user.languageCode,
    tgAllowsWriteToPm: initData?.user.allowsWriteToPm,

    updateUser: updateUser,
  }
}