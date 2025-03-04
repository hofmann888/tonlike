import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { useAsyncInitialize } from "./useAsyncInitialize";
import { getSession } from "@/core/session";

export function useSession() { // TODO?: remove?
  const data = useAsyncInitialize(async () => {
    let session = await getSession();

    if (!session?.user) {
      try {
          const { initDataRaw } = retrieveLaunchParams();
          const auth = await fetch('/auth', {
            method: 'POST',
            headers: {
              Authorization: `${initDataRaw}`
            },
          });
          
          const authResponse = await auth.json();
          if (authResponse.success) {
            session = authResponse.session;
          }
      } catch (e) {
        console.log('useSession Error:', e);
      }
    }
    
    return session;
  }, []);

  return data; // TODO: return { user: data?.user, ... };
}
