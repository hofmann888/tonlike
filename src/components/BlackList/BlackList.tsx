'use client'

import { type BlackListItem, type BlackListReasonsMapItem, BlackListReasonEnum } from "@/lib/definitions";
import { useState } from "react";
import BlackListCard from "./BlackListCard";

export const blackListReasonsMap: BlackListReasonsMapItem[] = [
  { key: BlackListReasonEnum.TASK, title: 'blackListReasonTask' },
  { key: BlackListReasonEnum.ACCOUNT, title: 'blackListReasonAccount' },
  { key: BlackListReasonEnum.BEHAVIOUR, title: 'blackListReasonBehaviour' },
  { key: BlackListReasonEnum.OTHER, title: 'reasonOther' },
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