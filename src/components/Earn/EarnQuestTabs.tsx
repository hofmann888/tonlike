import { useRouter, usePathname } from "next/navigation";
import { QuestSection } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/tabs";

export default function EarnQuestTabs({ activeTab }: { activeTab: QuestSection }) {
  const t = useTranslations('components.EarnQuestTabs');
  const pathname = usePathname();
  const router = useRouter();

  const [tab, setTab] = useState(activeTab);

  useEffect(() => {
    router.push(`${pathname}?tab=quests&section=${tab}`);
  }, [tab]);
  
  return (
    <Tabs
      aria-label="Quest section"
      variant="bordered"
      color="primary"
      selectedKey={tab}
      onSelectionChange={(key) => setTab(key as QuestSection)}
    >
      <Tab
        key="app"
        title={
          <div className="flex items-center space-x-2">
            <span>{t('app')}</span>
          </div>
        }
      />

      <Tab
        key="partners"
        title={
          <div className="flex items-center space-x-2">
            <span>{t('partners')}</span>
          </div>
        }
      />
    </Tabs>
  )
}