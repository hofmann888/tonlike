'use client'

import { useDisclosure } from "@heroui/modal";
import { useState } from "react";
import { Task } from "@/lib/definitions";
import { HideUserEarnTask } from "@/db/actions";
import EarnItem from "./EarnItem";
import EarnItemReportModal from "./EarnItemReportModal";

export default function EarnList({tasks}: {tasks: Task[]}) {
  const [tasksFiltered, setTasksFiltered] = useState(tasks); // TODO?: optimize, just remove html block
  const [reportTaskId, setReportTaskId] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function hideClick(id: number) {
    if (await HideUserEarnTask(id)) {
      const tasksAfterFilter = tasksFiltered.filter(task => task.id !== id);
      setTasksFiltered(tasksAfterFilter); // TODO: remove filter component if task list is empty
    }
  }

  function reportClick(id: number) {
    setReportTaskId(id);
    onOpen();
  }

  console.log('tasks:', tasks);

  return (
    <>
      {tasksFiltered.length ? tasksFiltered.map((task) => (
        <EarnItem 
          key={task.id} 
          task={task} 
          onHideClick={() => hideClick(task.id)} 
          onReportClick={() => reportClick(task.id)} 
        />
      )) : <p className="text-center mt-4">No tasks found.</p>}

      <EarnItemReportModal isOpen={isOpen} onOpenChange={onOpenChange} taskId={reportTaskId} />
    </>
  )
}