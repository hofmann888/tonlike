'use client'

import { FaShareAlt } from "react-icons/fa";
import { Button } from "@heroui/button";
import { FaCopy } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";

export default function ReferralsButtons({ bot, app }: { bot: string, app: string }) {
  const { tgId } = useUser();
  const link = `https://t.me/${bot}/${app}?startapp=${tgId}`;

  // window.clipboardData.setData("Text", 'Copy this text to clipboard') // TODO: support for old browsers

  return (
    <div className="w-full flex sticky bottom-[60px] py-2 bg-background">
      <Button color="primary" variant="shadow" size="lg" className="w-full mr-2" endContent={<FaShareAlt />} aria-label="Invite">
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