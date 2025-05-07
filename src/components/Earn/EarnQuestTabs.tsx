import { QuestSection } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";

export function TabWrap({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="z-0 w-full flex group relative justify-center items-center cursor-pointer transition-opacity tap-highlight-transparent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30 data-[hover-unselected=true]:opacity-disabled outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 h-8 text-small rounded-small p-0">
      {children}
    </div>
  )
}

const tabLinks = [
  { key: 'app', href: '/earn/quests', t: 'app' },
  { key: 'partners', href: '/earn/quests?section=partners', t: 'partners' },
]

export default function EarnQuestTabs({ activeTab }: { activeTab: QuestSection }) {
  const t = useTranslations('components.EarnQuestTabs');

  return (
    <Tabs
      aria-label="Quest section"
      variant="bordered"
      color="primary"
      selectedKey={activeTab}
      classNames={{
        tab: "p-0",
        tabContent: "w-full h-full"
      }}
    >
      {tabLinks.map((link) => {
        const activeClass = activeTab === link.key ? 'text-foreground-900' : '';

        return (
          <Tab
            as={TabWrap}
            key={link.key}
            title={
              <Link href={link.href} prefetch={true} className={`w-full h-full flex items-center justify-center gap-1 px-3 ${activeClass}`}>
                <span>{t(link.t)}</span>
              </Link>
            }
          />
        )
      })}
    </Tabs>
  )
}