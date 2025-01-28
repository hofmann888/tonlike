

import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Quest } from "@/lib/definitions";
import { actionIcons } from "@/lib/icons";
import { IconType } from "react-icons";
import CoinValue from "../Common/CoinValue";

export default function EarnQuestItem({ quest }: { quest: Quest }) {
  const title = quest.title ? quest.title : quest.action?.name;

  const iconKey = quest.actionId as keyof typeof actionIcons;
  const ActionIcon = actionIcons.hasOwnProperty(iconKey) ? actionIcons[iconKey] as IconType : undefined; // TODO: type

  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            alt={quest.service?.name}
            // size="sm"
            classNames={{
              base: "bg-gradient-to-b from-pink-500 to-blue-500",
              icon: "text-2xl"
            }}
            src={quest.service?.icon ?? quest.service?.icon}
            icon={!quest.service?.icon && ActionIcon ? <ActionIcon /> : undefined}
          />

          <div className="flex flex-col">
            {quest.link 
              ?
                <>
                  <span className="text-medium">{ title }</span>
                  <Link isExternal showAnchorIcon className="text-small" href='/img/social/telegram.png'>
                    {quest.link}
                  </Link>

                  {/* <Link isExternal showAnchorIcon href='/img/social/telegram.png'>
                    {quest.link}
                  </Link>
                  <span className="text-small text-foreground-400">{ title }</span> */}
                </>
              : <span className="text-medium">{ title }</span>
            }
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center text-medium mr-6">
            <CoinValue value={quest.price} />
          </div>

          <div className="flex items-center">
            <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}