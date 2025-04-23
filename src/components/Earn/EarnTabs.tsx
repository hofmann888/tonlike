'use client'

// import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";
import { GoGoal } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import Link from "next/link";

// TODO: add chips to count tasks
export default function EarnTabs({ activeTab }: { activeTab: string }) {
  const t = useTranslations('components.EarnTabs');

  return (
    <Tabs
      aria-label="Status"
      variant="underlined"
      color="primary"
      radius="none"
      selectedKey={activeTab}
      classNames={{
        base: "w-full mb-3",
        cursor: "w-full",
        tabList: "w-full p-0 border-b border-divider",
        tab: "px-0 h-14 data-[selected=true]:bg-[#ffffff12]",
        tabContent: "group-data-[selected=true]:text-foreground-900"
      }}
    >
      <Tab
        key="tasks"
        as={Link}
        href="/earn"
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
        as={Link}
        href="/earn?tab=quests"
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