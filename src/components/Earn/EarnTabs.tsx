'use client'

// import { Chip } from "@heroui/chip";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";
import { GoGoal } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import Link from "next/link";

export function TabWrap({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-small rounded-none px-0 h-14 data-[selected=true]:bg-[#ffffff12]">
      {children}
    </div>
  )
}

const tabLinks = [
  { key: 'tasks', href: '/earn/tasks', t: 'tasks', icon: BiTask },
  { key: 'quests', href: '/earn/quests', t: 'quests', icon: GoGoal },
]

// TODO: add chips to count tasks
export default function EarnTabs() {
  const t = useTranslations('components.EarnTabs');
  
  const pathname = usePathname();
  const activeTab = pathname.includes('/earn/quests') ? 'quests' : 'tasks';

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
        tabContent: "group-data-[selected=true]:text-foreground-900 w-full h-full flex items-center"
      }}
    >
      {tabLinks.map((link) => {
        const LinkIcon = link.icon;
        const activeClass = activeTab === link.key ? 'bg-[#ffffff12] text-foreground-900' : '';

        return (
          <Tab
            as={TabWrap}
            key={link.key}
            title={
              <Link href={link.href} prefetch={true} className={`w-full h-full flex items-center justify-center gap-1 ${activeClass}`}>
                <LinkIcon />
                <span>{t(link.t)}</span>
                {/* <Chip size="sm" variant="faded">888</Chip> */}
              </Link>
            }
          />
        )
      })}
    </Tabs>
  )  
}