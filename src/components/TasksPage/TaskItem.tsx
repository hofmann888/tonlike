'use client'

import { Card, CardHeader, CardFooter } from "@nextui-org/card";
import { Progress } from "@nextui-org/progress";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Task, TaskStatusEnum } from "@/lib/definitions";
import { FaPause, FaPlay, FaTrashAlt } from "react-icons/fa";


export default function TaskItem({
  task, 
  onPauseClick, 
  onDeleteClick,
  onActivateClick,
}: {
  task: Task, 
  onPauseClick: (id: number) => void,
  onDeleteClick: (id: number) => void,
  onActivateClick: (id: number) => void
}) {
  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardHeader className="justify-between pb-2">
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

        <span className="text-medium text-green-600">${task.price}</span>

        <div className="flex gap-1">
          {task.status === TaskStatusEnum.ACTIVE && 
            <Button isIconOnly aria-label="pause" color="warning" variant="faded" onPress={() => onPauseClick(task.id)}>
              <FaPause />
            </Button>}
          {task.status === TaskStatusEnum.PAUSED && 
            <Button isIconOnly aria-label="activate" color="success" variant="faded" onPress={() => onActivateClick(task.id)}>
              <FaPlay />
            </Button>}

          {[TaskStatusEnum.ACTIVE, TaskStatusEnum.PAUSED].includes(task.status) &&
            <Button isIconOnly aria-label="delete" color="danger" variant="faded" onPress={() => onDeleteClick(task.id)}>
              <FaTrashAlt />
            </Button>}
        </div>
      </CardHeader>

      <CardFooter className="pt-2">
        <Progress
          classNames={{
            track: "drop-shadow-md border border-default",
            indicator: "bg-gradient-to-r from-pink-500 to-blue-500",
            label: "tracking-wider font-medium text-default-600",
            value: "text-foreground/60",
          }}
          label={`Progress: ${task.done} / ${task.count}`}
          showValueLabel={true}
          size="sm"
          value={task.done}
          maxValue={task.count}
        />
      </CardFooter>
    </Card>
  )
}