import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useRef, useState, useEffect } from 'react';
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
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
  const t = useTranslations('components.EarnTaskReportModal');
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
      setMessage(t('success'));
      onSubmit(id);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{t('task')} #{taskId}</ModalHeader>

        <ModalBody>
          {message.length 
            ? <span className="text-medium">{message}</span> 
            : <EarnTaskReportForm taskId={taskId} formRef={formRef} afterSubmit={afterSubmit} />
          }
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            {t('close')}
          </Button>
          {!message.length && 
            <Button color="primary" onPress={reportClick} isLoading={loading}>
              {t('report')}
            </Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}