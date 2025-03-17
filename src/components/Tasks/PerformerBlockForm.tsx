import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { blackListReasonsMap } from "../BlackList/BlackList";
import { PerformerBlockFormState } from "@/lib/definitions";
import { PerformerBlockFormSubmit } from "@/core/actions";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { useState } from "react";

export default function PerformerBlockForm({ 
  formRef, blockUserId, afterSubmit
}: { 
  formRef: any, blockUserId: number, afterSubmit: (success: boolean, id: number) => void 
}) {
  const initialState: PerformerBlockFormState = { errors: {}, message: null };
  const action = PerformerBlockFormSubmit.bind(null, blockUserId);
  const [state, formAction] = useFormState(action, initialState);
  const [reasons, setReasons] = useState([] as string[]);
  const [comment, setComment] = useState('');
  
  const t = useTranslations('i18n');

  if (state?.success !== undefined) {
    afterSubmit(state?.success, blockUserId);
    state.success = undefined;
  }

  return (
    <Form action={formAction} validationErrors={state?.errors} ref={formRef}>
      <CheckboxGroup 
        name="reasons" 
        label={t('reasonsSelect')} 
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
        {blackListReasonsMap.map((item) => (
          <Checkbox key={item.key} value={item.key}>{t(item.title)}</Checkbox>
        ))}
      </CheckboxGroup>

      <Textarea 
        name="comment" 
        label={t('comment')} 
        placeholder={t('commentPlaceholder')}
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

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-danger" key={state.message}>
            {state.message}
          </p>
        }
      </div>
    </Form>
  )
}