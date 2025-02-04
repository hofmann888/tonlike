'use client'

import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { Task } from "@/lib/definitions";
import { HideUserEarnTask } from "@/core/actions";
import EarnTaskItem from "./EarnTaskItem";
import EarnItemReportModal from "./EarnItemReportModal";

export default function EarnTaskList({tasks}: {tasks: Task[]}) {
  const [tasksFiltered, setTasksFiltered] = useState(tasks); // TODO?: optimize, just remove html block
  const [reportTaskId, setReportTaskId] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function hideClick(id: number) {
    const result = await HideUserEarnTask(id);
    if (result.success) {
      const tasksAfterFilter = tasksFiltered.filter(task => task.id !== id);
      setTasksFiltered(tasksAfterFilter); // TODO: remove filter component if task list is empty
    }
    console.log(result); // TODO: display errors. And success message?
  }

  function reportClick(id: number) {
    setReportTaskId(id);
    onOpen();
  }

  function earnItemReported(id: number) {
    const tasksAfterFilter = tasksFiltered.filter(task => task.id !== id);
    setTasksFiltered(tasksAfterFilter); // TODO: remove filter component if task list is empty
  }

  useEffect(() => {
    setTasksFiltered(tasks);
  }, [tasks]);

  return (
    <>
      {tasksFiltered.length ? tasksFiltered.map((task) => (
        <EarnTaskItem 
          key={task.id} 
          task={task} 
          onHideClick={() => hideClick(task.id)} 
          onReportClick={() => reportClick(task.id)} 
        />
      )) : <p className="text-center mt-4">No tasks found.</p>}

      <EarnItemReportModal 
        taskId={reportTaskId} 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        earnItemReported={earnItemReported} 
      />
    </>
  )
}