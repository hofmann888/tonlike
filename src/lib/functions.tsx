import { cache } from 'react';
import { useTonConnect } from "@/hooks/useTonConnect";
import { fetchUserByAddress } from "@/db/sql";
import { User } from "./definitions";


export const getConnectedUser = cache(async () => {
  const { connected, address } = useTonConnect();

  if (connected) {
    return await fetchUserByAddress(address as string) as User;
  }
});