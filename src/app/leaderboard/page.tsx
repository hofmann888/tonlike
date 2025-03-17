'use server'

import { fetchLeaderboardPositionByUserId, fetchLeaderboard } from "@/db/query";
import { LeaderboardItem } from "@/lib/definitions";
import { getAuthUser } from "@/core/session";
import Leaderboard from "@/components/Leaderboard/Leaderboard";
import PageLoader from "@/components/Common/PageLoader";

export default async function LeaderboardPage() {
  const user = await getAuthUser();
  if (!user) return (<PageLoader />);

  const [leaderboard, userPosition] = await Promise.all([
    fetchLeaderboard(10),
    fetchLeaderboardPositionByUserId(user.id), // TODO?: fetch item?
  ]);

  const userLeaderboardItem: LeaderboardItem = {
    position: userPosition,
    balance: user.balance,
    tgUsername: user.tgUsername,
    tgPhotoUrl: user.tgPhotoUrl,
  }

  return (
    <div className="py-5 px-2 max-w-[500px] max-[500px]:max-w-[100vw]">
      <Leaderboard leaderboard={leaderboard} userLeaderboardItem={userLeaderboardItem} />
    </div>
  )
}