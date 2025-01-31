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
import { Task } from "@/lib/definitions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import CoinValue from "../Common/CoinValue";

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
            alt={task.service?.title}
            size="sm"
            src={task.service?.icon}
            className="w-10 h-10"
          />
          <div className="flex flex-col">
            <Link isExternal showAnchorIcon href={task.link}>
              <span className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">{task.link}</span>
            </Link>
            <span className="text-small text-foreground-400">{task.action?.title}</span>
          </div>
        </div>

        <div className="flex items-center text-medium"><span className="text-green-600">+</span> <CoinValue value={task.price} /></div>

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