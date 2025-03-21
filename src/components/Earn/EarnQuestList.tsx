'use client'

import { Chip } from "@heroui/chip";
import { Alert } from "@heroui/alert";
import { Quest } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import EarnQuestCard from "./EarnQuestCard";

export default function EarnQuestList({ quests }: { quests: Quest[] }) {
  const t = useTranslations('components.EarnQuestList');

  return (
    <div className="px-2">
      <Alert 
        color="warning"
        className="px-3 gap-0"
        title={<p>{t('warning')}</p>} 
      />

      <Chip color="primary" variant="dot" className="mb-2">{t('daily')}</Chip>
      {quests.map((quest) => (
        quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}

      <Chip color="primary" variant="dot" className="my-2">{t('oneTime')}</Chip>
      {quests.map((quest) => (
        !quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}
    </div>
  )
}