import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { type BlackListItem } from "@/lib/definitions";
import { blackListReasonsMap } from "./BlackList";
import { PerformerUnblock } from "@/core/actions";
import { FaInfoCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function BlackListCard({ 
  blackListItem,
  userUnblocked
}: { 
  blackListItem: BlackListItem,
  userUnblocked: (id: number) => void
}) {
  const t = useTranslations('i18n');

  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function onUnblockClick() {
    setIsLoading(true);
    const { success } = await PerformerUnblock(blackListItem.blockedUser?.id as number);
    if (success) {
      userUnblocked(blackListItem.blockedUser?.id as number);
      setIsLoading(false);
    }
  }
  
  return (
    <Card 
      className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
      shadow="sm"
      isBlurred
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex">
          <div className="text-tiny mr-3 max-[340px]:hidden">
            <p>{blackListItem.createdAt.toLocaleDateString('ru-RU')}</p>
            <p>{blackListItem.createdAt.toLocaleTimeString('ru-RU')}</p>
          </div>

          <User
            avatarProps={{
              isBordered: true,
              src: blackListItem.blockedUser?.tgPhotoUrl as string,
              size: 'sm',
            }}
            classNames={{
              name: "justify-start text-red-500 inline-block max-w-20 overflow-hidden text-ellipsis whitespace-nowrap"
            }}
            name={!!blackListItem.blockedUser?.tgUsername?.length ? `@${blackListItem.blockedUser.tgUsername}` : '???'}
          />
        </div>

        <div className="flex items-center">
          <Button 
            variant="light" 
            color="primary" 
            className="mr-2 max-[440px]:min-w-8 max-[440px]:p-0" 
            startContent={<FaInfoCircle />}
            onPress={() => setShowDetails(!showDetails)}
          >
            <span className="max-[440px]:hidden">{t('details')}</span>
          </Button>

          <Button 
            variant="flat" 
            color="success" 
            className="w-24" 
            isLoading={isLoading} 
            onPress={() => onUnblockClick()}
          >
            {!isLoading && t('unblock')}
          </Button>
        </div>
      </CardBody>

      {showDetails && 
        <CardFooter className="block pt-0">
          {!!blackListItem.comment?.length && 
            <div className="text-small">
              {t('comment')}: <span className="text-foreground-500">{blackListItem.comment}</span>
            </div>
          }

          <div className="text-small mt-1">
            {t('reasons')}: 
            {blackListItem.reasons.map((reason, idx) => {
              const reasonMapItem = blackListReasonsMap.find((item) => item.key === reason);
              return reasonMapItem ? (
                <Chip key={idx} size="sm" variant="faded" color="warning" className="ml-1 mt-1">{t(reasonMapItem.title)}</Chip>
              ) : '';
            })}
          </div>
        </CardFooter>
      }
    </Card>
  )
}