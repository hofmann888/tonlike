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
import { actionIcons } from "@/lib/const";
import { FaCheck } from "react-icons/fa";
import { IconType } from "react-icons";
import CoinValue from "../Common/CoinValue";

// TODO: quest progress (e.g. 3/5 friends invited...)

export default function EarnQuestCard({ quest }: { quest: Quest }) {
  const title = quest.title ? quest.title : (quest.serviceAction.title ?? quest.action?.title);
  const iconKey = quest.action?.name as keyof typeof actionIcons;
  const ActionIcon = actionIcons.hasOwnProperty(iconKey) ? actionIcons[iconKey] as IconType : undefined; // TODO: type
  const dailyDone = quest.daily && quest.doneLastAt ? checkDailyDone(quest.doneLastAt) : false;
  const oneTimeDone = !quest.daily && !!quest.doneLastAt;
  const questIsDone = dailyDone || oneTimeDone; // TODO?: checkQuestDone?

  const [check, setCheck] = useState(false);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const onReward = useCallback(() => {
    setCheck(true);
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    setCheck(false);
    console.error('Adsgram onError:', JSON.stringify(result, null, 4));
  }, []);
  const showAd = useAdsgram({ onReward, onError });

  async function startClick() {
    setLoading(true);

    if (quest.service?.name === ServiceNameEnum.APP) {
      if (quest.serviceAction.name === ServiceActionNameEnum.APP_AD) {
        showAd();
        setTimeout(() => {
          setChecking(true);
          setLoading(false);
        }, 5000);
        return;
      }

      checkClick();
      return;
    }

    const link = formatLink(quest.link as string, quest.service?.name as ServiceName, 'link'); // TODO?: remove?...already formated in action on creation
    if (tgOpenLink(link)) {
      setChecking(true);
    }
    setLoading(false);
  }


  async function checkClick() {
    setLoading(true);

    const result = await checkQuest(quest.id, check);
    const toast = {
      color: result?.success ? "success" : "danger",
      title: result?.success ? "Success." : "Something went wrong.",
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
            src={quest.service?.icon}
            icon={!quest.service?.icon && ActionIcon ? <ActionIcon /> : undefined}
          />

          <div className="flex flex-col mr-3">
            <span className="text-medium">{ title }</span>
            <div className="flex items-center text-small text-primary-500">
              + <CoinValue value={quest.price} />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
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
                : !loading && (checking ? 'Check' : 'Start')
              }
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}