'use client'

import { useRouter, usePathname } from "next/navigation";
import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Task } from "@/lib/definitions";
import EarnTaskCard from "./EarnTaskCard";
import EarnTaskHideModal from "./EarnTaskHideModal";
import EarnTaskReportModal from "./EarnTaskReportModal";

export default function EarnTaskList({
  tasks, page, pageTotal, pageItemsSize, itemsTotal
}: {
  tasks: Task[], page: number, pageTotal: number, pageItemsSize: number, itemsTotal: number
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // TODO: refactor modals logic
  const [modalTaskId, setModalTaskId] = useState(0);
  const [hideModalIsOpen, setHideModalIsOpen] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);

  const t = useTranslations('components.EarnTaskList');

  function pushPage(page: number) {
    router.push(`${pathname}?page=${page}`);
  }

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
    router.refresh();
  }

  return (
    <div className="px-2">
      {tasks.length ? tasks.map((task) => (
        <EarnTaskCard 
          key={task.id} 
          task={task} 
          onHideClick={() => hideClick(task.id)} 
          onReportClick={() => reportClick(task.id)} 
        />
      )) : <p className="text-center text-medium mt-4" dangerouslySetInnerHTML={{__html: t.raw('empty')}} />}

      {itemsTotal > pageItemsSize && 
        <Pagination 
          showControls 
          total={pageTotal} 
          page={page} 
          variant="bordered"
          classNames={{ base: "flex justify-center my-5" }}
          onChange={(page: number) => pushPage(page)}
        />
      }

      <EarnTaskHideModal 
        taskId={modalTaskId} 
        onSubmit={modalSubmit} 
        isOpen={hideModalIsOpen}
        onOpenChange={hideModalOnOpenChange}
        onClose={() => hideModalOnOpenChange(false)}
      />

      <EarnTaskReportModal 
        taskId={modalTaskId} 
        onSubmit={modalSubmit} 
        isOpen={reportModalIsOpen}
        onOpenChange={reportModalOnOpenChange}
        onClose={() => reportModalOnOpenChange(false)}
      />
    </div>
  )
}