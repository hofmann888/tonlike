import { addToast, ToastProps } from "@heroui/toast";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Quest, ServiceActionNameEnum, ServiceName, ServiceNameEnum } from "@/lib/definitions";
import { checkDailyDone, formatLink, tgOpenLink } from "@/utils/helpers";
import { checkQuest } from "@/utils/quest-checks";
import { ShowPromiseResult } from "@/lib/adsgram";
import { useAdsgram } from "@/hooks/useAdsgram";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { actionIcons } from "@/lib/const";
import { FaCheck } from "react-icons/fa";
import { IconType } from "react-icons";
import CoinValue from "@/components/Common/CoinValue";

// TODO: quest progress (e.g. 3/5 friends invited...)

export default function EarnQuestCard({ quest }: { quest: Quest }) {
  let countText;
  if (quest.daily && quest.countPerUser > 1) { // TODO?: count for one-time?
    countText = `${quest.doneCountToday}/${quest.countPerUser}`;
  }
  const title = quest.title ? quest.title : (quest.serviceAction.title ?? quest.action?.title);
  const iconKey = quest.action?.name as keyof typeof actionIcons;
  const ActionIcon = actionIcons.hasOwnProperty(iconKey) ? actionIcons[iconKey] as IconType : undefined; // TODO: type
  const dailyDone = quest.daily && quest.doneLastAt && quest.doneCountToday! >= quest.countPerUser ? checkDailyDone(quest.doneLastAt) : false;
  const oneTimeDone = !quest.daily && !!quest.doneLastAt;
  const questIsDone = dailyDone || oneTimeDone; // TODO?: checkQuestDone?

  const t = useTranslations('components.EarnQuestCard');
  const tEnums = useTranslations('enums');

  const [check, setCheck] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const onReward = useCallback(() => {
    setCheck(true);
    setChecking(true);
    setLoading(false);
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    setCheck(false);
    setLoading(false);
    addToast({
      color: "danger",
      title: t('error'),
    } as ToastProps);
    console.error('Adsgram onError:', JSON.stringify(result, null, 4));
  }, []);
  const showAd = useAdsgram({ onReward, onError });

  async function startClick() {
    setLoading(true);

    if (quest.service?.name === ServiceNameEnum.APP) {
      quest.serviceAction.name === ServiceActionNameEnum.APP_AD ? showAd() : checkClick();
      return;
    }

    const link = formatLink(quest.link as string, quest.service?.name as ServiceName, 'link'); // TODO?: remove?...already formated in action on creation
    if (tgOpenLink(link)) {
      setTimeout(() => {
        setLoading(false);
        setChecking(true);
      }, 5000);
    } else {
      setLoading(false);
    }
  }


  async function checkClick() {
    setLoading(true);

    const result = await checkQuest(quest.id, check);
    const toast = {
      color: result?.success ? "success" : "danger",
      title: result?.success ? t('success') : t('error'),
      description: result?.message,
    };

    addToast(toast as ToastProps);
    setCheck(false);
    setChecking(false);
    setLoading(false);
  }

  return (
    <Card 
      key={quest.id}
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-2"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar
            alt={quest.service?.title}
            classNames={{
              base: `${quest.service?.name === ServiceNameEnum.APP && 'bg-gradient-to-b from-pink-500 to-blue-500'} w-10 h-10 min-w-10 min-h-10`,
              icon: "text-2xl"
            }}
            src={quest.icon ?? quest.service?.icon}
            icon={!quest.service?.icon && ActionIcon ? <ActionIcon /> : undefined}
          />

          <div className="flex flex-col mr-3">
            <span className="text-medium">{ tEnums(`actions.${title}`) }</span>
            {!!quest.description?.length &&
              <span className="text-small text-foreground-400">{ tEnums(`actions.${quest.description}`) }</span>
            }
            <div className="flex items-center text-small text-primary-500">
              + <CoinValue value={quest.price} />
            </div>
          </div>
        </div>

        <Button 
          color="primary" 
          className="btn-border-shadow w-20" 
          variant={checking ? "solid" : "bordered"}
          isLoading={loading}
          isDisabled={questIsDone}
          isIconOnly={questIsDone}
          onPress={() => checking ? checkClick() : startClick()}
        >
          {questIsDone 
            ? <FaCheck /> 
            : !loading && (checking ? t('check') : countText ?? t('start'))
          }
        </Button>
      </CardBody>
    </Card>
  )
}