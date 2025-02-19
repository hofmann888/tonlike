import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { ReportReasonsMapItem, ReportReasonEnum, EarnTaskReportFormState } from "@/lib/definitions";
import { EarnTaskReportFormSubmit } from "@/core/actions";
import { useFormState } from "react-dom";
import { useState } from "react";

const reportReasonsMap: ReportReasonsMapItem[] = [
  { key: ReportReasonEnum.UNAVAILABLE, title: 'Task is unavailable' },
  { key: ReportReasonEnum.SCAM, title: 'Scam' },
  { key: ReportReasonEnum.SPAM, title: 'Spam' },
  { key: ReportReasonEnum.COPYRIGHT, title: 'Copiright' },
  { key: ReportReasonEnum.CONTENT, title: 'Inappropriate content (violance, pornography, politics)' },
  { key: ReportReasonEnum.OTHER, title: 'Other' },
];

export default function EarnTaskReportForm({ 
  taskId, formRef, afterSubmit
}: { 
  taskId: number, formRef: any, afterSubmit: (success: boolean, id: number) => void 
}) {
  const initialState: EarnTaskReportFormState = { errors: {}, message: null };
  const action = EarnTaskReportFormSubmit.bind(null, taskId);
  const [state, formAction] = useFormState(action, initialState);
  const [reasons, setReasons] = useState([] as string[]);
  const [comment, setComment] = useState('');

  if (state?.success !== undefined) {
    afterSubmit(state?.success, taskId);
    state.success = undefined;
  }

  return (
    <Form action={formAction} validationErrors={state?.errors} ref={formRef}>
      <CheckboxGroup 
        name="reasons" 
        label="Select reasons" 
        color="primary" 
        value={reasons}
        onValueChange={(value) => {
          setReasons(value);
          if (state?.errors?.reasons?.length) {
            delete state?.errors?.reasons;
          }
        }}
        isInvalid={!!state?.errors?.reasons?.length}
        errorMessage={state?.errors?.reasons?.length ? state.errors.reasons[0] : ''}
        isRequired
      >
        {reportReasonsMap.map((item) => (
          <Checkbox key={item.key} value={item.key}>{item.title}</Checkbox>
        ))}
      </CheckboxGroup>

      <Textarea 
        name="comment" 
        label="Comment" 
        placeholder="Enter your comment" 
        className="mt-3" 
        value={comment}
        onValueChange={(value) => {
          setComment(value);
          if (state?.errors?.comment?.length) {
            delete state?.errors?.comment;
          }
        }}
        isInvalid={!!state?.errors?.comment?.length}
        errorMessage={state?.errors?.comment?.length ? state.errors.comment[0] : ''}
      />

      {state?.message &&
        <p className="mt-2 text-sm text-danger" key={state.message}>
          {state.message}
        </p>
      }
    </Form>
  )
}