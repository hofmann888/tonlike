'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useEffect, useState } from "react";
import { HideEarnWaning } from "@/core/actions";

export default function EarnWaringModal() {
  const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
  const [dontShow, setDontShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => onOpen, []);

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
        <ModalHeader className="flex flex-col gap-1 text-warning text-center">Warning</ModalHeader>
        <ModalBody>
          <p className="text-medium">
            We recommend that you complete tasks responsibly. Otherwise, you may be banned and lose all your earnings.
          </p>
        </ModalBody>
        <ModalFooter className="justify-between">
          <Checkbox isSelected={dontShow} onValueChange={setDontShow}>Don't show again</Checkbox>
          <Button color="primary" onPress={hide} isLoading={loading}>
            I Understand
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}