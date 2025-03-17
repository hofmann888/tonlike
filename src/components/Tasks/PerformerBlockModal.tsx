import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from 'react';
import PerformerBlockForm from "./PerformerBlockForm";

export default function PerformerBlockModal({ 
  blockUserId, isOpen, onOpenChange, performerBlocked
}: {
  blockUserId: number,
  isOpen: boolean,
  onOpenChange: () => void,
  onClose: () => void,
  performerBlocked: (id: number) => void
}) {
  const t = useTranslations('i18n');
  const formRef: any = useRef(null);
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
    }
  }, [isOpen]);

  function onBlockClick() {
    setSubmitLoading(true);
    formRef.current.requestSubmit();
  }

  function afterSubmit(success: boolean, id: number) {
    setSubmitLoading(false);

    if (success) {
      setMessage(t('blockPerformerSuccessMsg'));
      performerBlocked(id);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{t('blockPerformer')}</ModalHeader>

            <ModalBody>
              {message.length 
                ? <p className="text-medium">{message}</p> 
                : <PerformerBlockForm formRef={formRef} blockUserId={blockUserId} afterSubmit={afterSubmit} />
              }
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                {t('close')}
              </Button>
              {!message.length && 
                <Button color="primary" onPress={onBlockClick} isLoading={submitLoading}>
                  {t('block')}
                </Button>
              }
            </ModalFooter>
         </>
        )}
      </ModalContent>
    </Modal>
  )
}