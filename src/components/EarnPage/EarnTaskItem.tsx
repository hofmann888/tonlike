import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';
import { FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { checkTask } from "@/utils/task-checks";
import { Task } from "@/lib/definitions";
import { useState } from "react";
import CoinValue from "../Common/CoinValue";


export default function EarnTaskItem({
  task,
  onHideClick,
  onReportClick
}: {
  task: Task,
  onHideClick: (id: number) => void,
  onReportClick: (id: number) => void
}) {
  const actionTitle = task.serviceAction?.title ?? task.action?.title;

  const [status, setStatus] = useState<'start'|'check'|'loading'|'failed'>('start');
  // const [loading, setLoading] = useState(false);

  function startClick() {
    if (openTelegramLink.isAvailable()) {
      openTelegramLink('https://t.me/deadgens');
    } 
    setStatus('check');
    // else if (openLink.isAvailable()) {
    //   openLink('https://telegram.org', {
    //     tryInstantView: true,
    //   });
    // }
  }

  async function checkClick() {
    setStatus('loading');

    const check = await checkTask(task.id);
    console.log('checkClick check:', check);
    if (!check) {
      setStatus('start');
    }
  }

  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            alt={task.service?.title}
            size="sm"
            src={task.service?.icon}
            className="w-10 h-10"
          />
          <div className="flex flex-col">
            <Link isExternal showAnchorIcon href={task.link}>
              <span className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">{task.link}</span>
            </Link>
            <span className="text-small text-foreground-400">{actionTitle}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center text-medium mr-6">
             <CoinValue value={task.price} />
          </div>

          <div className="flex items-center">
            {status === 'start' 
            ? <Button 
                color="primary" 
                variant="bordered" 
                className="btn-border-shadow mr-3"
                onPress={() => startClick()}
              >
                  Start
              </Button>
            : <Button 
                color="secondary" 
                variant="bordered" 
                className="btn-border-shadow mr-3"
                isLoading={status === 'loading'}
                onPress={() => checkClick()}
              >
                  {status !== 'loading' && 'Check'}
              </Button>
            }
            
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly aria-label="Earn Task Actions Button" variant="light">
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