import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { ReportReasonsMapItem, ReportReasonEnum, EarnItemReportFormState } from "@/lib/definitions";
import { EarnItemReportFormSubmit } from "@/core/actions";
import { useFormState } from "react-dom";

const reportReasonsMap: ReportReasonsMapItem[] = [
  { key: ReportReasonEnum.UNAVAILABLE, title: 'Task is unavailable' },
  { key: ReportReasonEnum.SCAM, title: 'Scam' },
  { key: ReportReasonEnum.SPAM, title: 'Spam' },
  { key: ReportReasonEnum.COPYRIGHT, title: 'Copiright' },
  { key: ReportReasonEnum.CONTENT, title: 'Inappropriate content (violance, pornography, politics) ' },
  { key: ReportReasonEnum.OTHER, title: 'Other' },
];

export default function EarnTaskReportForm({ 
  taskId, formRef, afterSubmit
}: { 
  taskId: number, formRef: any, afterSubmit: (success: boolean, id: number) => void 
}) {
  const initialState: EarnItemReportFormState = { errors: {}, message: null }; // TODO: errors not working
  const action = EarnItemReportFormSubmit.bind(null, taskId);
  const [state, formAction] = useFormState(action, initialState);

  if (state?.success !== undefined) {
    afterSubmit(state?.success, taskId);
    state.success = undefined;
  }

  return (
    <Form action={formAction} validationErrors={state?.errors} ref={formRef}>
      <CheckboxGroup name="reasons" label="Select reasons" color="primary" isRequired>
        {reportReasonsMap.map((item) => (
          <Checkbox key={item.key} value={item.key}>{item.title}</Checkbox>
        ))}
      </CheckboxGroup>

      <Textarea name="comment" label="Comment" placeholder="Enter your comment" className="mt-3" />

      {state?.message &&
        <p className="mt-2 text-sm text-danger" key={state.message}>
          {state.message}
        </p>
      }
    </Form>
  )
}