'use server'

import { getAuthUser } from "@/core/session";
import { User } from "@/lib/definitions";
import { cookies } from "next/headers";
import EarnWaringModal from "@/components/Earn/EarnWarningModal";
import PageLoader from "@/components/Common/PageLoader";
import EarnTabs from "@/components/Earn/EarnTabs";

export default async function EarnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const earnWarningShow = !cookies().get('earnWarningHide')?.value;

  return (
    <div className="flex flex-col h-full max-w-[500px] max-[500px]:max-w-[100vw]">
      <EarnTabs />

      {children}
      
      {earnWarningShow && <EarnWaringModal />}
    </div> 
  )
}