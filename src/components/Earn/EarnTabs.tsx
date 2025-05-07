'use client'

// import { Chip } from "@heroui/chip";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";
import { GoGoal } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import Link from "next/link";

// TODO: add chips to count tasks
export default function EarnTabs() {
  const t = useTranslations('components.EarnTabs');

  const pathname = usePathname();

  const tab = pathname.includes('/earn/quests') ? 'quests' : 'tasks';

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
        tabContent: "group-data-[selected=true]:text-foreground-900 w-full h-full flex items-center"
      }}
    >
      <Tab
        key="tasks"
        title={
          <Link href="/earn/tasks" prefetch={true} className="w-full h-full flex items-center justify-center gap-1">
            <BiTask />
            <span>{t('tasks')}</span>
            {/* <Chip size="sm" variant="faded">888</Chip> */}
          </Link>
        }
      />

      <Tab
        key="quests"
        title={
          <Link href="/earn/quests" prefetch={true} className="w-full h-full flex items-center justify-center gap-1">
              <GoGoal />
              <span>{t('quests')}</span>
              {/* <Chip size="sm" variant="faded">8</Chip> */}
          </Link>
        }
      />
    </Tabs>
  )  
}