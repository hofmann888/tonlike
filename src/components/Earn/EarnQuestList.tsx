'use client'

import { Chip } from "@heroui/chip";
import { Quest } from "@/lib/definitions";
import EarnQuestCard from "./EarnQuestCard";

export default function EarnQuestList({ quests }: { quests: Quest[] }) {
  console.log('EarnQuestList');

  return (
    <div className="px-2">
      <Chip color="primary" variant="dot" className="mb-2">Daily</Chip>
      {/* <p className="text-large text-primary mb-3">Daily</p> */}
      {quests.map((quest) => (
        quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}

      <Chip color="primary" variant="dot" className="my-2">One-time</Chip>
      {quests.map((quest) => (
        !quest.daily && 
          <EarnQuestCard key={quest.id} quest={quest} />
        )
      )}
    </div>
  )
}