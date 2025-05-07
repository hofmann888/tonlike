import { QuestSection } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";

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
      <Tab
        key="app"
        title={
          <Link href="/earn/quests" prefetch={true} className="w-full h-full flex items-center justify-center gap-1 px-3">
            <span>{t('app')}</span>
          </Link>
        }
      />

      <Tab
        key="partners"
        title={
          <Link href="/earn/quests?section=partners" prefetch={true} className="w-full h-full flex items-center justify-center gap-1 px-3">
            <span>{t('partners')}</span>
          </Link>
        }
      />
    </Tabs>
  )
}