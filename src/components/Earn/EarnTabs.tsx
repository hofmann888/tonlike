'use client'

// import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { GoGoal } from "react-icons/go";
import { BiTask } from "react-icons/bi";

// TODO: add chips to count tasks
export default function EarnTabs({ activeTab }: { activeTab: string }) {
  const t = useTranslations('components.EarnTabs');
  const pathname = usePathname();
  const router = useRouter();

  const [tab, setTab] = useState(activeTab);

  useEffect(() => {
    router.push(`${pathname}?tab=${tab}`);
  }, [tab]);

  return (
    <Tabs
      aria-label="Status"
      variant="underlined"
      color="primary"
      radius="none"
      selectedKey={tab}
      classNames={{
        base: "w-full mb-3",
        cursor: "w-full",
        tabList: "w-full p-0 border-b border-divider",
        tab: "px-0 h-14 data-[selected=true]:bg-[#ffffff12]",
        tabContent: "group-data-[selected=true]:text-foreground-900"
      }}
      onSelectionChange={(key) => setTab(key as string)}
    >
      <Tab
        key="tasks"
        title={
          <div className="flex items-center space-x-2">
            <BiTask />
            <span>{t('tasks')}</span>
            {/* <Chip size="sm" variant="faded">888</Chip> */}
          </div>
        }
      />

      <Tab
        key="quests"
        title={
          <div className="flex items-center space-x-2">
            <GoGoal />
            <span>{t('quests')}</span>
            {/* <Chip size="sm" variant="faded">8</Chip> */}
          </div>
        }
      />
    </Tabs>
  )  
}