import { ReportReasonEnum, BlackListReasonEnum, ServiceNameEnum } from '@/lib/definitions';
import { ServiceActionsRelationsEnum } from '@/db/schema';
import { fetchServiceActionById } from '@/db/query';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

// TODO: return only first error of array (+ refactor form components on heroui error logic)
export async function formatErrors(errors: any) {
  const t = await getTranslations('errors.forms');
  
  for (var key in errors) {
    if (errors[key]) {
      errors[key] = errors[key].map((error: string) => t(error))
    }
  }

  return errors as any;
}

export const createTaskFormSchema = z.object({
  serviceActionId: z.coerce.number()
    .positive({ message: 'createTaskForm.serviceActionId.positive' })
    .refine(async (id) => {
      const serviceAction = await fetchServiceActionById(id, [ServiceActionsRelationsEnum.ACTION, ServiceActionsRelationsEnum.SERVICE]);
      return serviceAction && serviceAction.active && serviceAction.action?.active && serviceAction.service?.active && serviceAction.service?.name !== ServiceNameEnum.APP;
    }, { message: 'createTaskForm.serviceActionId.refine' }),
  link: z.string()
    .min(3, { message: 'createTaskForm.link.min' })
    .max(255, { message: 'createTaskForm.link.max' })
    .regex(/^(https?:\/\/|@)/, { message: 'createTaskForm.link.regex' }), // TODO: check link format by service
  price: z.coerce.number().min(1, { message: 'createTaskForm.price.min'}),
  count: z.coerce.number().min(10, { message: 'createTaskForm.count.min'}),
});

export const editTaskFormSchema = z.object({
  price: z.coerce.number().min(1, { message: 'editTaskForm.price.min'}),
  count: z.coerce.number().min(10, { message: 'editTaskForm.count.min'}),
});

export const performerBlockFormSchema = z.object({
  reasons: z.enum([
    BlackListReasonEnum.TASK, 
    BlackListReasonEnum.ACCOUNT, 
    BlackListReasonEnum.BEHAVIOUR, 
    BlackListReasonEnum.OTHER
  ], { message: 'performerBlockForm.reasons.enum' })
    .array()
    .nonempty({ message: 'performerBlockForm.reasons.nonempty' }),
  comment: z.string().max(5000, { message: 'performerBlockForm.comment.max' }),
});

export const earnTaskReportFormSchema = z.object({
  reasons: z.enum([
    ReportReasonEnum.UNAVAILABLE, 
    ReportReasonEnum.SCAM, 
    ReportReasonEnum.SPAM, 
    ReportReasonEnum.COPYRIGHT, 
    ReportReasonEnum.CONTENT, 
    ReportReasonEnum.OTHER
  ], { message: 'earnTaskReportForm.reasons.enum' })
    .array()
    .nonempty({ message: 'earnTaskReportForm.reasons.nonempty' }),
  comment: z.string().max(5000, { message: 'earnTaskReportForm.comment.max' }),
});