import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { type BlackListItem } from "@/lib/definitions";
import { blackListReasonsMap } from "./BlackList";
import { PerformerUnblock } from "@/core/actions";
import { FaInfoCircle } from "react-icons/fa";
import { useState } from "react";
import clsx from "clsx";

export default function BlackListCard({ 
  blackListItem,
  userUnblocked
}: { 
  blackListItem: BlackListItem,
  userUnblocked: (id: number) => void
}) {
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
        <div className="text-tiny">
          <p>{blackListItem.createdAt.toLocaleDateString()}</p>
          <p>{blackListItem.createdAt.toLocaleTimeString()}</p>
        </div>

        <User
          avatarProps={{
            isBordered: true,
            src: blackListItem.blockedUser?.tgPhotoUrl,
            size: 'sm',
          }}
          className={clsx(
            'w-1/3 justify-start',
            {'text-red-500': true},
          )}
          name={`@${blackListItem.blockedUser?.tgUsername}`}
        />

        <div>
          <Button 
            variant="light" 
            color="primary" 
            className="w-24 mr-2" 
            startContent={<FaInfoCircle />}
            onPress={() => setShowDetails(!showDetails)}
          >
            Details
          </Button>

          <Button 
            variant="flat" 
            color="success" 
            className="w-24" 
            isLoading={isLoading} 
            onPress={() => onUnblockClick()}
          >
            {!isLoading && 'Unblock'}
          </Button>
        </div>
      </CardBody>

      {showDetails && 
        <CardFooter className="block pt-0">
          {!!blackListItem.comment?.length && 
            <div className="text-small">
              Comment: <span className="text-foreground-500">{blackListItem.comment}</span>
            </div>
          }

          <div className="text-small mt-1">
            Reasons: 
            {blackListItem.reasons.map((reason, idx) => {
              const reasonMapItem = blackListReasonsMap.find((item) => item.key === reason) 
              return (
                <Chip key={idx} size="sm" variant="faded" color="warning" className="ml-1 mt-1">{reasonMapItem?.title}</Chip>
              )
            })}
          </div>
        </CardFooter>
      }
    </Card>
  )
}