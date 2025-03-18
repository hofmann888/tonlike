'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Checkbox } from "@heroui/checkbox";
import { Button } from "@heroui/button";
import { HideEarnWaning } from "@/core/actions";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function EarnWaringModal() {
  const t = useTranslations('components.EarnWaringModal');

  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

  const [dontShow, setDontShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => onOpen(), []);

  async function hide() {
    setLoading(true);
    await HideEarnWaning(dontShow);
    onClose();
    setLoading(false);
  }
  
  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      hideCloseButton={true}
      isDismissable={false} 
      isKeyboardDismissDisabled={true} 
      placement="center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-warning text-center">{t('warning')}</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            {t('message')}
          </p>
        </ModalBody>
        <ModalFooter className="justify-between">
          <Checkbox isSelected={dontShow} onValueChange={setDontShow}>{t('dontShow')}</Checkbox>
          <Button color="primary" onPress={hide} isLoading={loading}>
            {t('understand')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}