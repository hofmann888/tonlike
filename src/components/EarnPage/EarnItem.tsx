'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";
import { Card, CardBody } from "@nextui-org/card";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Task } from "@/lib/definitions";
import { PiDotsThreeOutlineVerticalFill, PiCoinVertical } from "react-icons/pi";
import { FaEyeSlash, FaExclamationCircle } from "react-icons/fa";

export default function EarnItem({
  task,
  onHideClick,
  onReportClick
}: {
  task: Task,
  onHideClick: (id: number) => void,
  onReportClick: (id: number) => void
}) {
  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardBody className="flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            alt={task.service.name}
            className="flex-shrink-0"
            size="sm"
            src={task.service.img}
          />
          <div className="flex flex-col">
            <Link isExternal showAnchorIcon href={task.link}>
              {task.link}
            </Link>
            <span className="text-small text-foreground-400">{task.action.name}</span>
          </div>
        </div>

        <div className="flex items-center text-medium"><span className="text-green-600">+</span> <PiCoinVertical /> {task.price}</div>

        <div className="flex items-center">
          <Button color="primary" variant="bordered" className="btn-border-shadow mr-3">Start</Button>
          
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
      </CardBody>
    </Card>
  )
}