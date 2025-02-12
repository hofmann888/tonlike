'use client'

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { Task, TaskStatus, TaskStatusEnum } from "@/lib/definitions";
import { ChangeTaskStatus } from "@/core/actions";
import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [modalText, setModalText] = useState('');
  const [modalTaskId, setModalTaskId] = useState(0);
  const [newStatus, setNewStatus] = useState('');
  const [tasksPaginated, setTasksPaginated] = useState([] as Task[]);
  const [page, setPage] = useState(1); // TODO: useRouter and searchParams

  const pageItemsSize = 5;

  async function changeTaskStatus() {
    await ChangeTaskStatus(modalTaskId, newStatus as TaskStatus);
    onClose();
  }

  function activateButtonClick(id: number) {
    setModalText('Activate');
    setModalTaskId(id);
    setNewStatus(TaskStatusEnum.ACTIVE);
    onOpen();
  }

  function pauseButtonClick(id: number) {
    setModalText('Pause');
    setModalTaskId(id);
    setNewStatus(TaskStatusEnum.PAUSED);
    onOpen();
  }

  function deleteButtonClick(id: number) {
    setModalText('Delete');
    setModalTaskId(id);
    setNewStatus(TaskStatusEnum.DELETED);
    onOpen();
  }

  useEffect(() => {
    setPage(1);
  }, [tasks])

  useEffect(() => {
    console.log('useEffect paginate takskaksda');
    const start = (page - 1) * pageItemsSize;
    const end = start + pageItemsSize;
    setTasksPaginated(tasks.slice(start, end));
  }, [page, tasks]);

  return (
    <div className="px-2">
      {tasksPaginated.length ? tasksPaginated.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onPauseClick={() => pauseButtonClick(task.id)} 
          onDeleteClick={() => deleteButtonClick(task.id)} 
          onActivateClick={() => activateButtonClick(task.id)} 
          />
      )) : <p className="text-center">No tasks found.</p>}

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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Task {modalTaskId}</ModalHeader>
              <ModalBody>
                <p>{modalText} this task</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={changeTaskStatus}>
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