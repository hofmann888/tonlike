import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FaPause, FaPlay, FaTrashAlt, FaUserCheck, FaEdit } from "react-icons/fa";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Performer, Task, TaskStatusEnum } from "@/lib/definitions";
import { GetTaskPerformers } from "@/core/actions";
import { useState } from "react";
import TaskPerformersList from "./TaskPerformersList";
import EditTaskForm from "./EditTaskForm";
import CoinValue from "../Common/CoinValue";

// TODO!!!: return balance on delete
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
  const [performers, setPerformers] = useState([] as Performer[]);
  const [showPerformers, setShowPerformers] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const actionTitle = task.serviceAction?.title ?? task.action?.title;
  const doneCount = task.doneCount ?? 0;

  async function onPerformersClick() {
    if (showPerformers) {
      setShowPerformers(false);
      return;
    }
    
    setLoading(true);
    showEditForm && setShowEditForm(false);

    // TODO?: move to TaskPerformersList component? 
    const { data } = await GetTaskPerformers(task.id);
    if (data?.length) {
      setPerformers(data as Performer[]);
      setShowPerformers(true);
    }
    setLoading(false);
  }

  function onEditClick() {
    showPerformers && setShowPerformers(false);
    setShowEditForm(!showEditForm);
  }

  return (
    <Card 
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 mb-3"
      shadow="sm"
    >
      <CardBody className="flex-row pb-2">
        <div className="flex items-center gap-2 w-1/2">
          <Avatar
            size="sm"
            className="flex-shrink-0 w-10 h-10"
            src={task.service?.icon}
            alt={task.service?.title}
          />
          <div className="flex flex-col">
            <Link isExternal showAnchorIcon href={task.link}>
              <span className="max-w-24 overflow-hidden text-ellipsis whitespace-nowrap">{task.link}</span>
            </Link>
            <span className="text-small text-foreground-400">{actionTitle}</span>
          </div>
        </div>

        <div className="flex flex-row justify-between w-1/2">
          <CoinValue value={task.price} className="text-medium" />

          <div className="flex gap-1">
            {task.status === TaskStatusEnum.ACTIVE && 
              <Button isIconOnly aria-label="pause" color="warning" variant="faded" onPress={() => onPauseClick(task.id)}>
                <FaPause />
              </Button>
            }
            {task.status === TaskStatusEnum.PAUSED && 
              <Button isIconOnly aria-label="activate" color="success" variant="faded" onPress={() => onActivateClick(task.id)}>
                <FaPlay />
              </Button>
            }

            {[TaskStatusEnum.ACTIVE, TaskStatusEnum.PAUSED].includes(task.status) &&
              <Button isIconOnly aria-label="delete" color="danger" variant="faded" onPress={() => onDeleteClick(task.id)}>
                <FaTrashAlt />
              </Button>
            }

            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly aria-label="Task Actions Button" variant="light" isLoading={loading}>
                  <PiDotsThreeOutlineVerticalFill />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Task Actions">
                {![TaskStatusEnum.DONE, TaskStatusEnum.DELETED].includes(task.status) 
                  ? <DropdownItem key="edit" startContent={<FaEdit />} onPress={() => onEditClick()}>Edit</DropdownItem>
                  : null
                }
                <DropdownItem key="performers" startContent={<FaUserCheck />} onPress={() => onPerformersClick()}>Performers</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 flex-col">
        <Button variant="light" className="w-full p-0" data-hover="false" onPress={() => onPerformersClick()}>
          <Progress
            classNames={{
              track: "drop-shadow-md border border-default",
              indicator: "bg-gradient-to-r from-pink-500 to-blue-500",
              label: "tracking-wider font-medium text-default-600",
              value: "text-foreground/60",
            }}
            label={`Progress: ${doneCount} / ${task.count}`}
            showValueLabel={true}
            size="sm"
            value={doneCount}
            maxValue={task.count}
          />
        </Button>

        {showPerformers && 
          <>
            <TaskPerformersList performers={performers} /> 

            <Button color="danger" variant="light" className="mt-4 w-full" onPress={() => setShowPerformers(false)}>
              Close
            </Button>
          </>
        }

        {showEditForm && 
          <>
            <EditTaskForm task={task} />

            <Button color="danger" variant="light" className="mt-2 w-full" onPress={() => setShowEditForm(false)}>
              Close
            </Button>
          </>
        }
      </CardFooter>
    </Card>
  )
}