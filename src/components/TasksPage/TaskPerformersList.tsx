import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { PerformerUnblock } from "@/db/actions";
import { Performer } from "@/lib/definitions";
import { useState } from "react";
import PerformerBlockModal from "./PerformerBlockModal";
import clsx from "clsx";

// TODO?: move modal to tasklist component?
export default function TaskPerformersList({ taskId, performers }: { taskId:number, performers: Performer[] }) {
  // console.log('TaskPerformersList:', performers);
  // for (let i = 0; i < 20; i++) {
  //   performers.push(performers[1]);
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
    console.log('performerBlocked');
    updateBlockStatus(id, true);
  }

  function updateBlockStatus(id: number, isBlocked: boolean) { // TODO: loader
    const performersUpdate = performersState.map((performer) => {
      if (performer.id === id) {
        performer.is_blocked = isBlocked;
      }
      return performer;
    });;

    setPerformersState(performersUpdate);
  }

  return (
    <ScrollShadow className="w-full mt-2 pt-2 max-h-44 overflow-auto">
      {performersState.map((performer) => {
        const date = new Date(performer.created_at);

        return (
        <Card 
          key={performer.id} 
          className="border-none bg-background/60 dark:bg-default-100/50 mt-1"
          shadow="sm"
          // isBlurred
        >
          <CardBody className="flex-row justify-between items-center">
            <div className="text-tiny">
              <p>{date.toLocaleDateString()}</p>
              <p>{date.toLocaleTimeString()}</p>
            </div>

            <User
              avatarProps={{
                isBordered: true,
                src: performer.tg_photo_url,
                size: 'sm',
              }}
              className={clsx(
                'w-3/6 justify-start',
                {'text-red-500': performer.is_blocked},
              )}
              name={`@${performer.tg_username}`}
            />

            {performer.is_blocked 
              ? <Button color="success" variant="flat" className="w-24" onPress={() => onUnblockClick(performer.id)}>Unblock</Button>
              : <Button color="danger" variant="flat" className="w-24" onPress={() => onBlockClick(performer.id)}>Block</Button>
            }
          </CardBody>
        </Card>
      )})}

      <PerformerBlockModal 
        blockUserId={blockUserId}
        taskId={taskId} 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        onClose={onClose}
        performerBlocked={performerBlocked} 
      />
    </ScrollShadow>
  )
}