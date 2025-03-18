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
import { FaPause, FaPlay, FaTrashAlt, FaUserCheck, FaEdit } from "react-icons/fa";
import { Performer, Task, TaskStatusEnum } from "@/lib/definitions";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { GetTaskPerformers } from "@/core/actions";
import { FiExternalLink } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TgLinkButton from "@/components/Common/TgLinkButton";
import CoinValue from "@/components/Common/CoinValue";
import TaskPerformersList from "./TaskPerformersList";
import EditTaskForm from "./EditTaskForm";

export default function TaskCard({
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
  const t = useTranslations('components.TaskCard');
  const tEnums = useTranslations('enums');

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
      <CardBody className="flex-row justify-between pb-2 pr-0">
        <div className="flex items-center gap-2 w-1/2 max-[350px]:w-[40%]">
          <Avatar
            size="sm"
            className="flex-shrink-0 w-10 h-10"
            src={task.service?.icon}
            alt={task.service?.title}
          />
          <div className="flex flex-col max-w-[70%]">
            <TgLinkButton 
              link={task.link}
              className="justify-start"
              endContent={<FiExternalLink className="w-4 min-w-4 max-[400px]:w-3 max-[400px]:min-w-3" />}
            >
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-medium max-[400px]:text-small">{task.link}</span>
            </TgLinkButton>

            <span className="whitespace-nowrap text-small text-foreground-400">{tEnums(`actions.${actionTitle}`)}</span>
          </div>
        </div>

        <div className="flex justify-end w-1/2 max-[350px]:w-[60%]">
          <CoinValue value={task.price} className="mr-3 text-medium max-[400px]:text-small" />
          
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
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly aria-label="Task Actions Button" variant="light" isLoading={loading}>
                <PiDotsThreeOutlineVerticalFill />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Task Actions">
              {![TaskStatusEnum.DONE, TaskStatusEnum.DELETED].includes(task.status) 
                ? <DropdownItem key="edit" startContent={<FaEdit />} onPress={() => onEditClick()}>{t('edit')}</DropdownItem>
                : null
              }
              <DropdownItem key="performers" startContent={<FaUserCheck />} onPress={() => onPerformersClick()}>{t('performers')}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
            label={`${t('progress')}: ${doneCount} / ${task.count}`}
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
              {t('close')}
            </Button>
          </>
        }

        {showEditForm && 
          <>
            <EditTaskForm task={task} />

            <Button color="danger" variant="light" className="mt-2 w-full" onPress={() => setShowEditForm(false)}>
              {t('close')}
            </Button>
          </>
        }
      </CardFooter>
    </Card>
  )
}