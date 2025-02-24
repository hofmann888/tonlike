'use server'

import { fetchBlackListByUserId } from "@/db/query";
import { getAuthUser } from "../auth/session"
import BlackList from "@/components/BlackList/BlackList";
import PageLoader from "@/components/Common/PageLoader";

export default async function BlackListPage() {
  const user = await getAuthUser();
  if (!user) return (<PageLoader />);

  const blackList = await fetchBlackListByUserId(user.id);

  return (
    <div className="py-5 px-2">
      <BlackList blackList={blackList} />
    </div>
  )
}