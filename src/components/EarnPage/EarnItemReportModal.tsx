import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useRef, useState } from 'react';
import EarnItemReportForm from "./EarnItemReportForm";

export default function EarnItemReportModal({ 
  taskId, isOpen, onOpenChange, earnItemReported
}: {
  taskId: number,
  isOpen: boolean,
  onOpenChange: () => void,
  earnItemReported: (id: number) => void
}) {
  const formRef: any = useRef(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  function onReportClick() {
    setSubmitLoading(true);
    formRef.current.requestSubmit();
  }

  function afterSubmit(success: boolean, id: number) {
    setSubmitLoading(false);

    if (success) {
      setMessage('Task has been successfuly reported.');
      earnItemReported(id);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Report Task #{taskId}</ModalHeader>

              <ModalBody>
                {message.length 
                  ? message 
                  : <EarnItemReportForm taskId={taskId} formRef={formRef} afterSubmit={afterSubmit} />
                }
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {!message.length && <Button color="primary" onPress={onReportClick} isLoading={submitLoading}>
                  Report
                </Button>}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}