import { useAsyncInitialize } from "./useAsyncInitialize";
import { getSession } from "@/app/init-data/auth/session";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export function useSession() {
  const data = useAsyncInitialize(async () => {
    console.log('useSession useAsyncInitialize');
    let session = await getSession();

    if (!session?.user) {
      try {
          // const { initDataRaw } = retrieveLaunchParams();
          const initDataRaw = 'query_id=AAGgOwR_AgAAAKA7BH8pd9B2&user=%7B%22id%22%3A6425951136%2C%22first_name%22%3A%22%EF%BE%A0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22phnx888%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FQhwMIgschaSu3qybJbo7KL8mnz4-CD-y8VcKotCK5iDtGbmX6GCuVx7s6s05cYEl.svg%22%7D&auth_date=1734288731&signature=6TJRE7ToLltqVLTr51Zbeg8DD2BUYYyhVj_9PigaqhvMOrClOD5MaHrE6vAaBq_oOZUQz343UB_U8toPgofbDA&hash=bbe44205a58f6b9246318845bf113edc13a8afe1cc115845e59becadc3d81cc0';
          console.log('initDataRaw:'); console.log(initDataRaw);
    
          const auth = await fetch('/init-data/auth', {
            method: 'POST',
            headers: {
              Authorization: `${initDataRaw}`
            },
            // credentials: 'include',
          });
          
          const authResponse = await auth.json();
          console.log('authResponse:'); console.log(authResponse);

          if (authResponse.success) {
            session = authResponse.session;
          }
      } catch (e) {
        console.log('useSession error:'); console.log(e);
      }
    }
    
    console.log('useSession session:'); console.log(session);
    return session;
  }, []);

  return data; 
  // TODO:
  // return { 
  //   user: data?.user,
  //   ...
  // };
}
