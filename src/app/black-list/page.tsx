import { fetchBlackListByUserId } from "@/db/query";
import { getAuthUser } from "@/core/session"
import BlackList from "@/components/BlackList/BlackList";
import PageLoader from "@/components/Common/PageLoader";

export const revalidate = 3600;

export default async function BlackListPage() {
  const user = await getAuthUser();
  if (!user) return (<PageLoader />);

  const blackList = await fetchBlackListByUserId(user.id);

  return (
    <div className="py-5 px-2 max-w-[500px] max-[500px]:max-w-[100vw]">
      <BlackList blackList={blackList} />
    </div>
  )
}