import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Form } from "@nextui-org/form";
import { Textarea } from "@nextui-org/input";

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