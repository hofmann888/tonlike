'use client'

import { Task, TaskStatus, TaskStatusEnum } from "@/lib/definitions";
import { ChangeTaskStatus } from "@/db/actions";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@nextui-org/modal";
import { useState } from "react";
import TaskItem from "./TaskItem";


export default function TaskList({ tasks }: { tasks: Task[] }) {
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

  const [modalText, setModalText] = useState('');
  const [modalTaskId, setModalTaskId] = useState(0);
  const [newStatus, setNewStatus] = useState('');

  const changeTaskStatus = async () => {
    await ChangeTaskStatus(modalTaskId, newStatus as TaskStatus);
    onClose();
  }

  const stopButtonClick = (id: number) => {
    setModalText('Pause');
    setModalTaskId(id);
    setNewStatus(TaskStatusEnum.STOP);
    onOpen();
  }

  const deleteButtonClick = (id: number) => {
    setModalText('Delete');
    setModalTaskId(id);
    setNewStatus(TaskStatusEnum.DELETED);
    onOpen();
  }

  return (
    <div className="task-list">
      {tasks.length ? tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onStopClick={() => stopButtonClick(task.id)} 
          onDeleteClick={() => deleteButtonClick(task.id)} 
          />
      )) : <p className="text-center">No tasks found.</p>}

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