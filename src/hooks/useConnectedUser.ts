// import { useAsyncInitialize } from "./useAsyncInitialize";
// import { useTonConnect } from "./useTonConnect";
// // import { fetchUserByAddress } from "@/db/query";

// import { User } from "@/lib/definitions";
// import { UserContext } from "@/components/Providers/UserProvider";
// import { useContext } from "react";

// export function useConnectedUser() {
//   const { connected, address } = useTonConnect();

//   const { updateUser } = useContext(UserContext);

//   // const connected = true;
//   // const address = '0QCXwrih_8H9sGnGUBtgT0PpOzcoNZJkfWy901UjbmN6j8te';

//   const data = useAsyncInitialize(async () => {
//     console.log(`useConnectedUser: ${connected}`);
//     if (!connected) {
//       return null;
//     }

//     const user: User = await fetchUserByAddress(address as string);
//     console.log(user);
//     updateUser(user);
//     return user;
//   }, [connected, address]);

//   return { 
//     id: data?.id ?? null,
//     address: data?.address ?? null,
//     balance: data?.balance ?? 0,
//   };
// }
