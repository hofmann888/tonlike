import { PerformerUnblock } from "@/core/server-actions";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody } from "@heroui/card";
import { useDisclosure } from "@heroui/modal";
import { Performer } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { useState } from "react";
import PerformerBlockModal from "./PerformerBlockModal";
import CoinValue from "@/components/Common/CoinValue";

// TODO: add loaders on btn clicks
// TODO?: show no performers message on empty list
// TODO?: move modal to TaskList component
export default function TaskPerformersList({ performers }: { performers: Performer[] }) {
  const t = useTranslations('components.TaskPerformersList');

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
              <div className="flex items-center w-3/4 max-[400px]:w-3/5 max-[350px]:w-2/3">
                <div className="text-tiny mr-3">
                  <p>{date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })}</p>
                  <p>{date.toLocaleTimeString('ru-RU')}</p>
                </div>

                <User
                  avatarProps={{
                    isBordered: true,
                    src: performer.tgPhotoUrl as string,
                    size: 'sm',
                    className: "min-w-8 min-h-8"
                  }}
                  classNames={{ 
                    base: `w-[60%] max-[370px]:w-[50%] max-[350px]:w-[40%] justify-start ${performer.isBlocked && 'text-red-500'}`,
                    wrapper: "w-[70%]",
                    name: "w-full flex"
                  }}
                  name={
                    <span className="max-w-full inline-block overflow-hidden text-ellipsis whitespace-nowrap">
                      {!!performer.tgUsername?.length ? `@${performer.tgUsername}` : performer.tgId}
                    </span>
                  }
                  description={
                    <CoinValue 
                      value={performer.profit} 
                      classNames={{ base: "mr-3 text-tiny text-primary-500", avatar: "h-3 w-3 ml-0" }} 
                    />
                  }
                />
              </div>

              <div className="w-24 min-w-24 max-[350px]:w-20 max-[350px]:min-w-20 text-right text-small text-primary-500"> 
                {performer.isBlocked 
                  ? <Button color="success" variant="flat" className="w-full min-w-full" onPress={() => onUnblockClick(performer.id)}>{t('unblock')}</Button>
                  : <Button color="danger" variant="flat" className="w-full min-w-full" onPress={() => onBlockClick(performer.id)}>{t('block')}</Button>
                }
              </div>
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