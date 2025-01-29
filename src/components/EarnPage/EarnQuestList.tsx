'use client'

import { Chip } from "@heroui/chip";
import { Quest } from "@/lib/definitions";
import EarnQuestItem from "./EarnQuestItem";

export default function EarnQuestList({ quests }: { quests: Quest[] }) {
  console.log('EarnQuestList');

  return (
    <div>
      <Chip color="primary" variant="flat" className="mb-2">
        Daily
      </Chip>
      {/* <p className="text-large text-primary mb-3">Daily</p> */}
      {quests.map((quest) => (
        quest.daily && 
          <EarnQuestItem quest={quest} />
        )
      )}

      <Chip color="primary" variant="flat" className="my-2">
        One-time
      </Chip>
      {quests.map((quest) => (
        !quest.daily && 
          <EarnQuestItem quest={quest} />
        )
      )}
    </div>
  )
}