'use client'

import { type BlackListItem, type BlackListReasonsMapItem, BlackListReasonEnum } from "@/lib/definitions";
import { useState } from "react";
import BlackListCard from "./BlackListCard";
import { useTranslations } from "next-intl";

export const blackListReasonsMap: BlackListReasonsMapItem[] = [
  { key: BlackListReasonEnum.TASK, title: 'reasons.blackList.task' },
  { key: BlackListReasonEnum.ACCOUNT, title: 'reasons.blackList.account' },
  { key: BlackListReasonEnum.BEHAVIOUR, title: 'reasons.blackList.behaviour' },
  { key: BlackListReasonEnum.OTHER, title: 'reasons.blackList.other' },
];

export default function BlackList({ blackList }: { blackList: BlackListItem[] }) {
  const t = useTranslations('components.BlackList');

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
        : <p className="w-full text-center text-medium mt-2">{t('empty')}</p>
      }
    </div>
  )
}