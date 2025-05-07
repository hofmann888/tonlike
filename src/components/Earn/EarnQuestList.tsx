'use client'

import { Quest, QuestSection, QuestSectionEnum } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Chip } from "@heroui/chip";
import EarnQuestTabs from "./EarnQuestTabs";
import EarnQuestCard from "./EarnQuestCard";

export default function EarnQuestList({ 
  quests, section 
}: { 
  quests: Quest[],
  section: QuestSection
}) {
  const t = useTranslations('components.EarnQuestList');

  const showTabs = quests.some((quest) => quest.partner);
  if (!showTabs && section !== QuestSectionEnum.APP) {
    section = QuestSectionEnum.APP;
  }

  const daily = quests.filter((quest) => quest.daily && (section === QuestSectionEnum.APP && !quest.partner || section === QuestSectionEnum.PARTNERS && quest.partner));
  const oneTime = quests.filter((quest) => !quest.daily && (section === QuestSectionEnum.APP && !quest.partner || section === QuestSectionEnum.PARTNERS && quest.partner));

  return (
    <div className="px-2">
      {showTabs && 
        <div className="flex justify-center w-full mt-3">
          <EarnQuestTabs activeTab={section} />
        </div>
      }

      <div>
        {!!daily.length && <Chip color="primary" variant="dot" className="mb-2">{t('daily')}</Chip>}
        {daily.map((quest) => <EarnQuestCard key={quest.id} quest={quest} />)}

        {!!oneTime.length && <Chip color="primary" variant="dot" className="my-2">{t('oneTime')}</Chip>}
        {oneTime.map((quest) => <EarnQuestCard key={quest.id} quest={quest} />)}
      </div>
    </div>
  )
}