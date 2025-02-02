import { useAsyncInitialize } from "./useAsyncInitialize";
import { getSession } from "@/app/auth/session";
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

export function useSession() {
  const data = useAsyncInitialize(async () => {
    console.log('useSession useAsyncInitialize');
    let session = await getSession();

    if (!session?.user) {
      try {
          const { initDataRaw } = retrieveLaunchParams();
          console.log('initDataRaw:'); console.log(initDataRaw);
    
          const auth = await fetch('/auth', {
            method: 'POST',
            headers: {
              Authorization: `${initDataRaw}`
            },
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
