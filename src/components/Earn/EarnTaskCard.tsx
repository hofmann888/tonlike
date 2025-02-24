import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { addToast, ToastProps } from "@heroui/toast";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';
import { FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { checkTask } from "@/utils/task-checks";
import { Task } from "@/lib/definitions";
import { useState } from "react";
import CoinValue from "../Common/CoinValue";

// TODO?: show price instead of links?
export default function EarnTaskCard({
  task,
  onHideClick,
  onReportClick
}: {
  task: Task,
  onHideClick: (id: number) => void,
  onReportClick: (id: number) => void
}) {
  const actionTitle = task.serviceAction?.title ?? task.action?.title;
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  function startClick() {
    if (openTelegramLink.isAvailable()) {
      openTelegramLink('https://t.me/deadgens');
    } 
    setChecking(true);
    // else if (openLink.isAvailable()) { // TODO!
    //   openLink('https://telegram.org', {
    //     tryInstantView: true,
    //   });
    // }
  }

  async function checkClick() {
    setLoading(true);

    const result = await checkTask(task.id);
    const toast = {
      color: result.success ? "success" : "danger",
      title: result.success ? "Success." : "Something went wrong.",
      description: result.message,
    };

    addToast(toast as ToastProps);
    setChecking(false);
    setLoading(false);
  }

  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-2"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center pr-0">
        <div className="flex items-center gap-2">
          <Avatar
            size="sm"
            className="w-10 h-10"
            src={task.service?.icon}
            alt={task.service?.title}
          />
          <div className="flex flex-col">
            <span className="text-medium">{ actionTitle }</span>
            <div className="flex items-center text-small mr-3 text-primary-500">
              + <CoinValue value={task.price} />
            </div>
            {/* <Link isExternal showAnchorIcon className="text-tiny " href='/img/social/telegram.png'>
              <span className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">{task.link}</span>
            </Link> */}
          </div>
        </div>

        <div className="flex justify-between">
          {/* <div className="flex items-center text-small mr-3">
            <CoinValue value={task.price} />
          </div> */}
          
          <div className="flex items-center">
            <Button 
              color="primary"
              variant={checking ? "solid" : "bordered"}
              className="btn-border-shadow"
              onPress={() => checking ? checkClick() : startClick()}
              isLoading={loading}
            >
              {!loading && (checking ? 'Check' : 'Start')}
            </Button>
            
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <PiDotsThreeOutlineVerticalFill />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Earn Task Actions">
                <DropdownItem key="hide" startContent={<FaEyeSlash />} onPress={() => onHideClick(task.id)}>Hide</DropdownItem>
                <DropdownItem 
                  key="report" 
                  className="text-danger"
                  color="danger" 
                  startContent={<FaExclamationCircle />}
                  onPress={() => onReportClick(task.id)}
                >
                  Report
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}