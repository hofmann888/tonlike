import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { fetchUserByAddress } from "@/app/db/sql";
import { User } from "../lib/definitions";
import { useQuery } from "@tanstack/react-query";



export function useConnectedUser() {
  const { connected, address } = useTonConnect();

  // const connected = true;
  // const address = '0QCXwrih_8H9sGnGUBtgT0PpOzcoNZJkfWy901UjbmN6j8te';

  const data = useAsyncInitialize(async () => {
    console.log(`useConnectedUser: ${connected}`);
    if (!connected) {
      return null;
    }
    return fetchUserByAddress(address as string);
  }, [connected, address]);

  // if (!connected) return { 
  //   id: null,
  //   address: null,
  //   balance: 0,
  //   reward: 0,
  // };

  // TODO: hook after connected. Maybe custom connect function?: https://docs.ton.org/develop/dapps/ton-connect/web
  // const { isPending, error, data } = useQuery({
  //   queryKey: ['connectedUser'],
  //   queryFn: async () => {
  //     console.log(`useConnectedUser: ${connected}`);

  //     if (!connected) {
  //       return null;
  //     }
  //     return fetchUserByAddress(address as string);
  //   }
  // });

  return { 
    id: data?.id ?? null,
    address: data?.address ?? null,
    balance: data?.balance ?? 0,
    reward: data?.reward ?? 0,
  };
}
