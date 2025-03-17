import { Chip } from "@heroui/chip";
import { LeaderboardItem } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import LeaderboardCard from "@/components/Leaderboard/LeaderboardCard";

export default function Leaderboard({
  leaderboard, userLeaderboardItem 
}:{
  leaderboard: LeaderboardItem[],
  userLeaderboardItem: LeaderboardItem,
}) {
  const t = useTranslations('i18n');

  return (
    <>
      <div className="mb-8">
        <Chip color="primary" variant="dot" className="mb-2 border-none text-medium">{t('leaderboardMe')}:</Chip>
        <LeaderboardCard item={userLeaderboardItem} />
      </div>

      <Chip color="primary" variant="dot" className="mb-2 border-none text-medium">{t('leaderboardTop10')}:</Chip>
      {leaderboard.map((item, idx) => (
        <LeaderboardCard key={idx} item={item} />
      ))}
    </>
  )
}