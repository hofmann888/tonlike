import { User, Quest, QuestSection, QuestSectionEnum } from "@/lib/definitions";
import { fetchEarnQuestsByUserId } from "@/db/query";
import { getAuthUser } from "@/core/session";
import PageLoader from "@/components/Common/PageLoader";
import EarnQuestList from "@/components/Earn/EarnQuestList";

export const revalidate = 360;

export default async function EarnQuestsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const questSection = searchParams?.section as QuestSection ?? QuestSectionEnum.APP;

  let quests: Quest[] = [];
  quests = await fetchEarnQuestsByUserId(user.id);

  return (
    <EarnQuestList quests={quests} section={questSection} />
  )
}