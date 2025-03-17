'use client'

import { Chip } from "@heroui/chip";
import { Quest } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import EarnQuestCard from "./EarnQuestCard";

export default function EarnQuestList({ quests }: { quests: Quest[] }) {
  const t = useTranslations('i18n');

  return (
    <div className="px-2">
      <Chip color="primary" variant="dot" className="mb-2">{t('questsDaily')}</Chip>
      {quests.map((quest) => (
        quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}

      <Chip color="primary" variant="dot" className="my-2">{t('questsOneTime')}</Chip>
      {quests.map((quest) => (
        !quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}
    </div>
  )
}