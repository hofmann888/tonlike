'use server'

// import { Chip } from "@heroui/chip";
import { fetchLeaderboardPositionByUserId, fetchLeaderboard } from "@/db/query";
import { LeaderboardItem } from "@/lib/definitions";
import { getAuthUser } from "@/app/auth/session";
import LeaderboardCard from "@/components/Leaderboard/LeaderboardCard";
import PageLoader from "@/components/Common/PageLoader";

export default async function LeaderboardPage() {
  const user = await getAuthUser();
  if (!user) return (<PageLoader />);

  const [leaderboard, userPosition] = await Promise.all([
    fetchLeaderboard(),
    fetchLeaderboardPositionByUserId(user.id), // TODO?: fetch item?
  ]);

  const userLeaderboardItem: LeaderboardItem = {
    position: userPosition,
    balance: user.balance,
    tgUsername: user.tgUsername,
    tgPhotoUrl: user.tgPhotoUrl,
  }

  return (
    <div className="py-5 px-2">
      <div className="mb-10">
        <p className="text-medium">You:</p>
        {/* <Chip color="primary" variant="dot" className="mb-2">Your position:</Chip> */}
        <LeaderboardCard item={userLeaderboardItem} />
      </div>

      <p className="text-medium">Top 100:</p>
      {/* <Chip color="primary" variant="dot" className="mb-2">Top 100:</Chip> */}
      {leaderboard.map((item, idx) => (
        <LeaderboardCard key={idx} item={item} />
      ))}
    </div>
  )
}