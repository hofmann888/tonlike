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
    >
      <Tab
        key="app"
        as={Link}
        href="/earn?tab=quests"
        title={
          <div className="flex items-center space-x-2">
            <span>{t('app')}</span>
          </div>
        }
      />

      <Tab
        key="partners"
        as={Link}
        href="/earn?tab=quests&section=partners"
        title={
          <div className="flex items-center space-x-2">
            <span>{t('partners')}</span>
          </div>
        }
      />
    </Tabs>
  )
}