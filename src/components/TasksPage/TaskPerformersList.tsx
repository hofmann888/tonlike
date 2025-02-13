import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { PerformerUnblock } from "@/core/actions";
import { Performer } from "@/lib/definitions";
import { useState } from "react";
import PerformerBlockModal from "./PerformerBlockModal";
import clsx from "clsx";

// TODO?: move modal to tasklist component?
// TODO: move card to separate component and add loaders on btn clicks
// TODO: show no performers message on empty list
export default function TaskPerformersList({ performers }: { performers: Performer[] }) {
  // console.log('TaskPerformersList:', performers);
  // for (let i = 0; i < 20; i++) {
  //   performers.push(performers[0]);
  // }

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
        <Card 
          key={performer.id} 
          className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
          shadow="sm"
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="text-tiny">
              <p>{date.toLocaleDateString()}</p>
              <p>{date.toLocaleTimeString()}</p>
            </div>

            <User
              avatarProps={{
                isBordered: true,
                src: performer.tgPhotoUrl,
                size: 'sm',
              }}
              className={clsx(
                'w-3/6 justify-start',
                {'text-red-500': performer.isBlocked},
              )}
              name={`@${performer.tgUsername}`}
            />

            {performer.isBlocked 
              ? <Button color="success" variant="flat" className="w-24" onPress={() => onUnblockClick(performer.id)}>Unblock</Button>
              : <Button color="danger" variant="flat" className="w-24" onPress={() => onBlockClick(performer.id)}>Block</Button>
            }
          </CardBody>
        </Card>
      )})}

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