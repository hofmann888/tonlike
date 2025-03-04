'use client'

import { FaShareAlt } from "react-icons/fa";
import { Button } from "@heroui/button";
import { FaCopy } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import { shareURL } from '@telegram-apps/sdk-react';

// window.clipboardData.setData("Text", 'Copy this text to clipboard') // TODO: support for old browsers
// TODO?: NotAllowedError: Failed to execute 'writeText on 'Clipboard': Document is not focused. 
//        mobile on copy btn click in the first time (link is copying though)
// TODO?: add input with link (to copy not through button)?
export default function ReferralsButtons() {
  const { tgId } = useUser();
  const bot = process.env.NEXT_PUBLIC_TG_BOT_NAME as string;
  const app = process.env.NEXT_PUBLIC_TG_APP_NAME as string;
  const link = `https://t.me/${bot}/${app}?startapp=${tgId}`;

  return (
    <div className="w-full flex sticky bottom-[60px] py-2 bg-background">
      <Button 
        variant="shadow" 
        color="primary" 
        size="lg" 
        className="w-full mr-2" 
        aria-label="Invite"
        endContent={<FaShareAlt />}
        onPress={() => shareURL(link, 'Join now and earn 1000 $LIKE!')}
      >
        Invite a friend
      </Button>

      <Button 
        isIconOnly 
        variant="flat" 
        size="lg" 
        color="primary" 
        className="w-1/6" 
        aria-label="Copy"
        onPress={() => {navigator.clipboard.writeText(link)}}
      >
        <FaCopy />
      </Button>
    </div>
  )
}