import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { type BlackListItem } from "@/lib/definitions";
import { PerformerUnblock } from "@/core/server-actions";
import { blackListReasonsMap } from "./BlackList";
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
  const t = useTranslations('components.BlackListCard');
  const tEnums = useTranslations('enums');

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
        <div className="flex w-1/2">
          <div className="text-tiny mr-3 w-[52px] min-w-[52px] max-[340px]:hidden">
            <p>{blackListItem.createdAt.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
            <p>{blackListItem.createdAt.toLocaleTimeString('ru-RU')}</p>
          </div>

          <User
            avatarProps={{
              isBordered: true,
              src: blackListItem.blockedUser?.tgPhotoUrl as string,
              size: "sm",
              className: "min-w-8 min-h-8"
            }}
            classNames={{
              base: "w-[60%] justify-start",
              wrapper: "w-[70%] max-[340px]:w-full",
              name: "max-w-full text-red-500 inline-block overflow-hidden text-ellipsis whitespace-nowrap",
            }}
            name={!!blackListItem.blockedUser?.tgUsername?.length ? `@${blackListItem.blockedUser.tgUsername}` : blackListItem.blockedUser?.tgId}
          />
        </div>

        <div className="flex items-center">
          <Button 
            variant="light" 
            color="primary" 
            className="mr-1 px-3 max-[440px]:min-w-8 max-[440px]:p-0" 
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
                <Chip key={idx} size="sm" variant="faded" color="warning" className="ml-1 mt-1">{tEnums(reasonMapItem.title)}</Chip>
              ) : '';
            })}
          </div>
        </CardFooter>
      }
    </Card>
  )
}