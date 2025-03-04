'use client'

import { type BlackListItem, type BlackListReasonsMapItem, BlackListReasonEnum } from "@/lib/definitions";
import { useState } from "react";
import BlackListCard from "./BlackListCard";

export const blackListReasonsMap: BlackListReasonsMapItem[] = [
  { key: BlackListReasonEnum.TASK, title: 'Bad task completion' },
  { key: BlackListReasonEnum.ACCOUNT, title: 'Bad account' },
  { key: BlackListReasonEnum.BEHAVIOUR, title: 'Inappropriate behaviour' },
  { key: BlackListReasonEnum.OTHER, title: 'Other' },
];

export default function BlackList({ blackList }: { blackList: BlackListItem[] }) {
  const [blackListState, setBlackListState] = useState(blackList);

  function userUnblocked(id: number) {
    const blackListUpdate = blackListState.filter((blackListItem) => 
      blackListItem.blockedUserId !== id
    );
    setBlackListState(blackListUpdate);
  }

  return (
    <div>
      {!!blackListState.length 
        ? blackListState.map((blackListItem) => (
          <BlackListCard 
            key={blackListItem.id} 
            blackListItem={blackListItem}
            userUnblocked={userUnblocked}
          />
        ))
        : <p className="w-full text-center text-medium mt-2">Black list is empty.</p>
      }
    </div>
  )
}