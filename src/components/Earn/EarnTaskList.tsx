'use client'

import { useEffect, useState } from "react";
import { Task } from "@/lib/definitions";
import EarnTaskCard from "./EarnTaskCard";
import EarnTaskHideModal from "./EarnTaskHideModal";
import EarnTaskReportModal from "./EarnTaskReportModal";

export default function EarnTaskList({tasks}: {tasks: Task[]}) {
  const [tasksFiltered, setTasksFiltered] = useState(tasks); // TODO?: optimize, just remove html block
  const [modalTaskId, setModalTaskId] = useState(0);

  // TODO: peredelat' etu parashu s modalkami...ept ne mogli uchest' vneshnuu logiku? che ze cal...
  const [hideModalIsOpen, setHideModalIsOpen] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);

  function hideModalOnOpenChange(isOpen: boolean) {
    setHideModalIsOpen(isOpen);
  }

  function reportModalOnOpenChange(isOpen: boolean) {
    setReportModalIsOpen(isOpen);
  }

  function hideClick(id: number) {
    setModalTaskId(id);
    hideModalOnOpenChange(true);
  }

  function reportClick(id: number) {
    setModalTaskId(id);
    setReportModalIsOpen(true);
  }

  function modalSubmit(id: number) {
    const tasksAfterFilter = tasksFiltered.filter(task => task.id !== id);
    setTasksFiltered(tasksAfterFilter);
  }

  useEffect(() => {
    setTasksFiltered(tasks);
  }, [tasks]);

  return (
    <div className="px-2">
      {tasksFiltered.length ? tasksFiltered.map((task) => (
        <EarnTaskCard 
          key={task.id} 
          task={task} 
          onHideClick={() => hideClick(task.id)} 
          onReportClick={() => reportClick(task.id)} 
        />
      )) : <p className="text-center text-large mt-4">No tasks found.</p>}

      <EarnTaskReportModal 
        taskId={modalTaskId} 
        onSubmit={modalSubmit} 
        isOpen={reportModalIsOpen}
        onOpenChange={reportModalOnOpenChange}
        onClose={() => reportModalOnOpenChange(false)}
      />

      <EarnTaskHideModal 
        taskId={modalTaskId} 
        onSubmit={modalSubmit} 
        isOpen={hideModalIsOpen}
        onOpenChange={hideModalOnOpenChange}
        onClose={() => hideModalOnOpenChange(false)}
      />
    </div>
  )
}