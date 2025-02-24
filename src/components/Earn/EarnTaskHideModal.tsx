import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useState, useEffect } from 'react';
import { HideUserEarnTask } from "@/core/actions";

export default function EarnTaskHideModal({ 
  taskId, isOpen, onOpenChange, onClose, onSubmit
}: {
  taskId: number,
  isOpen: boolean,
  onClose: () => void,
  onOpenChange: (isOpen: boolean) => void,
  onSubmit: (id: number) => void
}) {
  const defaultMessage = 'Are you sure you want to hide this task?';
  const [message, setMessage] = useState(defaultMessage);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsHidden(false);
      setMessage(defaultMessage);
      setError('');
      return;
    }
  }, [isOpen]);

  async function hideClick() {
    setLoading(true);

    const result = await HideUserEarnTask(taskId);
    if (!result.success && result?.message) {
      setError(result.message);
    }

    if (result.success) {
      setIsHidden(true);
      setMessage('Task has been successfuly hidden.');
      onSubmit(taskId);
    }

    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Hide Task #{taskId}</ModalHeader>

        <ModalBody>
          <span className="text-medium">{message}</span> 

          {!!error.length &&
            <p className="mt-2 text-sm text-danger" key={error}>
              {error}
            </p>
          }
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          {!isHidden && 
            <Button color="primary" onPress={hideClick} isLoading={loading}>
              Hide
            </Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}