import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Textarea } from "@heroui/input";

export default function EarnItemReportModal({ 
  isOpen, onOpenChange, taskId
}: {
  isOpen: boolean,
  onOpenChange: () => void,
  taskId: number,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Report Task #{taskId}</ModalHeader>
              <ModalBody>
                {/* <Form action={formAction} className="create-task-form" validationErrors={state?.errors}> */}
                <Form>
                  <Textarea label="Description" placeholder="Enter your description" />
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary">
                  Report
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  )
}