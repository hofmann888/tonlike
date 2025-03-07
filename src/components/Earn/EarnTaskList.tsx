'use client'

import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { Task } from "@/lib/definitions";
import EarnTaskCard from "./EarnTaskCard";
import EarnTaskHideModal from "./EarnTaskHideModal";
import EarnTaskReportModal from "./EarnTaskReportModal";

export default function EarnTaskList({tasks}: {tasks: Task[]}) {
  const pageItemsSize = 10;
  const [page, setPage] = useState(1); // TODO: useRouter and searchParams
  const [total, setTotal] = useState(1);
  const [tasksFiltered, setTasksFiltered] = useState(tasks); // TODO?: optimize, just remove html block
  const [tasksPaginated, setTasksPaginated] = useState([] as Task[]); // TODO: db pagination
  
  // TODO: refactor modals logic
  const [modalTaskId, setModalTaskId] = useState(0);
  const [hideModalIsOpen, setHideModalIsOpen] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);

  useEffect(() => {
    setTasksFiltered(tasks);
  }, [tasks]);

  useEffect(() => {
    const start = (page - 1) * pageItemsSize;
    const end = start + pageItemsSize;
    setTasksPaginated(tasksFiltered.slice(start, end));
    setTotal(Math.ceil(tasksFiltered.length / pageItemsSize));
  }, [page, tasksFiltered]);

  useEffect(() => {
    if (page > total) {
      setPage(total);
    }
  }, [total]);

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

  return (
    <div className="px-2">
      {tasksPaginated.length ? tasksPaginated.map((task) => (
        <EarnTaskCard 
          key={task.id} 
          task={task} 
          onHideClick={() => hideClick(task.id)} 
          onReportClick={() => reportClick(task.id)} 
        />
      )) : <p className="text-center text-medium mt-4">No tasks found.</p>}

      {tasks.length > pageItemsSize && total > 1 && 
        <Pagination 
          showControls 
          total={total} 
          page={page} 
          variant="bordered"
          classNames={{ base: "flex justify-center my-5" }}
          onChange={(page: number) => setPage(page)}
        />
      }

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