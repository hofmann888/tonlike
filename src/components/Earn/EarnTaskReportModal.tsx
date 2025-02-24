import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useRef, useState, useEffect } from 'react';
import EarnTaskReportForm from "./EarnTaskReportForm";

export default function EarnTaskReportModal({ 
  taskId, isOpen, onClose, onOpenChange, onSubmit
}: {
  taskId: number,
  isOpen: boolean
  onClose: () => void,
  onOpenChange: (isOpen: boolean) => void,
  onSubmit: (id: number) => void,
}) {
  const formRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  function reportClick() {
    setLoading(true);
    formRef.current.requestSubmit();
  }

  function afterSubmit(success: boolean, id: number) {
    setLoading(false);

    if (success) {
      setMessage('Task has been successfuly reported.');
      onSubmit(id);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Report Task #{taskId}</ModalHeader>

        <ModalBody>
          {message.length 
            ? <span className="text-medium">{message}</span> 
            : <EarnTaskReportForm taskId={taskId} formRef={formRef} afterSubmit={afterSubmit} />
          }
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          {!message.length && 
            <Button color="primary" onPress={reportClick} isLoading={loading}>
              Report
            </Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}