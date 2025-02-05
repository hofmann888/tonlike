'use server'

import { fetchBlackListByUserId } from "@/db/query";
import { getAuthUser } from "../auth/session"
import BlackList from "@/components/BlackList/BlackList";

export default async function BlackListPage() {
  const user = await getAuthUser(false);
  const blackList = await fetchBlackListByUserId(user.id);

  return (
    <div className="py-5">
      <BlackList blackList={blackList} />
    </div>
  )
}