'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Task, TaskStatus, TaskStatusEnum } from "@/lib/definitions";
import { ChangeTaskStatus, DeleteTask } from "@/core/actions";
import { Pagination } from "@heroui/pagination";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const t = useTranslations('i18n');

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [modalError, setModalError] = useState('');
  const [modalText, setModalText] = useState('');
  const [modalTaskId, setModalTaskId] = useState(0);
  const [newStatus, setNewStatus] = useState('');
  const [tasksPaginated, setTasksPaginated] = useState([] as Task[]); // TODO: db pagination
  const [page, setPage] = useState(1); // TODO: useRouter and searchParams
  const [loading, setLoading] = useState(false);

  const pageItemsSize = 5;

  async function changeTaskStatus() {
    setLoading(true);

    let result;
    if (newStatus === TaskStatusEnum.DELETED) {
      result = await DeleteTask(modalTaskId);
    } else {
      result = await ChangeTaskStatus(modalTaskId, newStatus as TaskStatus);
    }

    if (result?.message) {
      setModalError(result?.message);
      setLoading(false);
      return;
    }

    onClose();
    setLoading(false);
  }

  // TODO: compbine to one function
  function activateButtonClick(id: number) {
    setNewStatus(TaskStatusEnum.ACTIVE);
    openModal(id, t('taskStatusActivate'));
  }
  function pauseButtonClick(id: number) {
    setNewStatus(TaskStatusEnum.PAUSED);
    openModal(id, t('taskStatusPause'));
  }
  function deleteButtonClick(id: number) {
    setNewStatus(TaskStatusEnum.DELETED);
    openModal(id, t('taskStatusDelete'));
  }

  function openModal(taskId: number, text: string) {
    setModalError('');
    setModalText(text);
    setModalTaskId(taskId);
    onOpen();
  }

  useEffect(() => {
    setPage(1);
  }, [tasks])

  useEffect(() => {
    const start = (page - 1) * pageItemsSize;
    const end = start + pageItemsSize;
    setTasksPaginated(tasks.slice(start, end));
  }, [page, tasks]);

  return (
    <div className="px-2">
      {tasksPaginated.length ? tasksPaginated.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onPauseClick={() => pauseButtonClick(task.id)} 
          onDeleteClick={() => deleteButtonClick(task.id)} 
          onActivateClick={() => activateButtonClick(task.id)} 
          />
      )) : <p className="text-center text-medium">{t('taskListEmpty')}</p>}

      {tasks.length > pageItemsSize && 
        <Pagination 
          showControls 
          total={Math.ceil(tasks.length / pageItemsSize)} 
          page={page} 
          variant="bordered"
          classNames={{ base: "flex justify-center my-5" }}
          onChange={(page: number) => setPage(page)}
        />
      }

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{t('task')} {modalTaskId}</ModalHeader>
              <ModalBody>
                <p className="text-medium">{modalText} {t('thisTask')}?</p>

                <div id="fields-error" aria-live="polite" aria-atomic="true">
                  {modalError &&
                    <p className="mt-2 text-sm text-danger" key={modalError}>
                      {modalError}
                    </p>
                  }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t('close')}
                </Button>
                <Button color="primary" onPress={changeTaskStatus} isLoading={loading}>
                  {modalText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}