import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { Textarea } from "@heroui/input";
import { Form } from "@heroui/form";
import { ReportReasonsMapItem, ReportReasonEnum, EarnTaskReportFormState } from "@/lib/definitions";
import { EarnTaskReportFormSubmit } from "@/core/actions";
import { useTranslations } from "next-intl";
import { useFormState } from "react-dom";
import { useState } from "react";

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

  const t = useTranslations();

  const reportReasonsMap: ReportReasonsMapItem[] = [
    { key: ReportReasonEnum.UNAVAILABLE, title: t('i18n.reportReasonUnavailable') },
    { key: ReportReasonEnum.SCAM, title: t('i18n.reportReasonScam') },
    { key: ReportReasonEnum.SPAM, title: t('i18n.reportReasonSpam') },
    { key: ReportReasonEnum.COPYRIGHT, title: t('i18n.reportReasonCopyright') },
    { key: ReportReasonEnum.CONTENT, title: t('i18n.reportReasonContent') },
    { key: ReportReasonEnum.OTHER, title: t('i18n.reportReasonOther') },
  ];

  if (state?.success !== undefined) {
    afterSubmit(state?.success, taskId);
    state.success = undefined;
  }

  return (
    <Form action={formAction} validationErrors={state?.errors} ref={formRef}>
      <CheckboxGroup 
        name="reasons" 
        label={t('i18n.reasonsSelect')} 
        color="primary" 
        value={reasons}
        onValueChange={(value) => {
          setReasons(value);
          if (state?.errors?.reasons?.length) {
            delete state?.errors?.reasons;
          }
        }}
        isInvalid={!!state?.errors?.reasons?.length}
        errorMessage={state?.errors?.reasons?.length ? t(`errors.forms.${state.errors.reasons[0]}`) : ''}
        isRequired
      >
        {reportReasonsMap.map((item) => (
          <Checkbox key={item.key} value={item.key}>{item.title}</Checkbox>
        ))}
      </CheckboxGroup>

      <Textarea 
        name="comment" 
        label={t('i18n.comment')} 
        placeholder={t('i18n.commentPlaceholder')}
        className="mt-3" 
        value={comment}
        onValueChange={(value) => {
          setComment(value);
          if (state?.errors?.comment?.length) {
            delete state?.errors?.comment;
          }
        }}
        isInvalid={!!state?.errors?.comment?.length}
        errorMessage={state?.errors?.comment?.length ? t(`errors.forms.${state.errors.comment[0]}`) : ''}
      />

      {state?.message &&
        <p className="mt-2 text-sm text-danger" key={state.message}>
          {state.message}
        </p>
      }
    </Form>
  )
}