import { ScrollShadow } from "@heroui/scroll-shadow";
import { PerformerUnblock } from "@/core/actions";
import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Performer } from "@/lib/definitions";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { useState } from "react";
import PerformerBlockModal from "./PerformerBlockModal";
import CoinValue from "../Common/CoinValue";
import clsx from "clsx";

// TODO?: add loaders on btn clicks
// TODO?: show no performers message on empty list
// TODO?: move modal to TaskList component
export default function TaskPerformersList({ performers }: { performers: Performer[] }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [blockUserId, setBlockUserId] = useState(0);
  const [performersState, setPerformersState] = useState(performers);

  function onBlockClick(id: number) {
    setBlockUserId(id);
    onOpen();
  }

  async function onUnblockClick(id: number) {
    const { success } = await PerformerUnblock(id);
    if (success) {
      updateBlockStatus(id, false);
    }
  }

  function performerBlocked(id: number) {
    updateBlockStatus(id, true);
  }

  function updateBlockStatus(id: number, isBlocked: boolean) {
    const performersUpdate = performersState.map((performer) => {
      if (performer.id === id) {
        performer.isBlocked = isBlocked;
      }
      return performer;
    });;

    setPerformersState(performersUpdate);
  }

  return (
    <ScrollShadow className="w-full mt-2 pt-2 px-2 max-h-44 overflow-auto">
      {performersState.map((performer) => {
        const date = new Date(performer.doneAt);

        return (
          // TODO?: move to separate component?
          <Card 
            key={performer.id} 
            className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
            shadow="sm"
          >
            <CardBody className="flex-row justify-between items-center">
              <div className="text-tiny mr-3">
                <p>{date.toLocaleDateString()}</p>
                <p>{date.toLocaleTimeString()}</p>
              </div>

              <User
                avatarProps={{
                  isBordered: true,
                  src: performer.tgPhotoUrl as string,
                  size: 'sm',
                }}
                className={clsx(
                  'w-1/2 justify-start',
                  {'text-red-500': performer.isBlocked},
                )}
                name={!!performer.tgUsername?.length 
                  ? <span className="inline-block max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">@{performer.tgUsername}</span> 
                  : '???'
                }
                description={<CoinValue value={performer.profit} className="mr-3 text-tiny text-primary-500" />}
              />

              {/* <CoinValue value={performer.profit} className="mr-3 text-small text-primary-500" /> */}

              {performer.isBlocked 
                ? <Button color="success" variant="flat" className="w-24" onPress={() => onUnblockClick(performer.id)}>Unblock</Button>
                : <Button color="danger" variant="flat" className="w-24" onPress={() => onBlockClick(performer.id)}>Block</Button>
              }
            </CardBody>
          </Card>
        )
      })}

      <PerformerBlockModal 
        blockUserId={blockUserId}
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        onClose={onClose}
        performerBlocked={performerBlocked} 
      />
    </ScrollShadow>
  )
}