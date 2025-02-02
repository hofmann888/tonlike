import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { BlackListReasonsMapItem, BlackListReasonEnum, PerformerBlockFormState } from "@/lib/definitions";
import { PerformerBlockFormSubmit } from "@/core/actions";
import { useFormState } from "react-dom";

const blackListReasonsMap: BlackListReasonsMapItem[] = [
  { key: BlackListReasonEnum.TASK, title: 'Bad task complition' },
  { key: BlackListReasonEnum.ACCOUNT, title: 'Bad account' },
  { key: BlackListReasonEnum.BEHAVIOUR, title: 'Inappropriate behaviour' },
  { key: BlackListReasonEnum.OTHER, title: 'Other' },
];

export default function PerformerBlockForm({ 
  formRef, blockUserId, afterSubmit
}: { 
  formRef: any, blockUserId: number, afterSubmit: (success: boolean, id: number) => void 
}) {
  const initialState: PerformerBlockFormState = { errors: {}, message: null }; // TODO: errors not working
  const action = PerformerBlockFormSubmit.bind(null, blockUserId);
  const [state, formAction] = useFormState(action, initialState);

  if (state?.success !== undefined) {
    afterSubmit(state?.success, blockUserId);
    state.success = undefined;
  }

  return (
    <Form action={formAction} validationErrors={state?.errors} ref={formRef}>
      <CheckboxGroup name="reasons" label="Select reasons" color="primary" isRequired>
        {blackListReasonsMap.map((item) => (
          <Checkbox key={item.key} value={item.key}>{item.title}</Checkbox>
        ))}
      </CheckboxGroup>

      <Textarea name="comment" label="Comment" placeholder="Enter your comment" className="mt-3" />

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>
    </Form>
  )
}