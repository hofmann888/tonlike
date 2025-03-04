import { ReportReasonEnum, BlackListReasonEnum, ServiceNameEnum } from '@/lib/definitions';
import { ServiceActionsRelationsEnum } from '@/db/schema';
import { fetchServiceActionById } from '@/db/query';
import { z } from 'zod';

export const createTaskFormSchema = z.object({
  serviceActionId: z.coerce.number()
    .positive({ message: 'Wrong action.' })
    .refine(async (id) => {
      const serviceAction = await fetchServiceActionById(id, [ServiceActionsRelationsEnum.ACTION, ServiceActionsRelationsEnum.SERVICE]);
      return serviceAction && serviceAction.active && serviceAction.action?.active && serviceAction.service?.active && serviceAction.service?.name !== ServiceNameEnum.APP;
    }, { message: 'Wrong action.' }),
  link: z.string()
    .min(3, { message: 'Must be 3 or more characters long.' })
    .max(255, { message: 'Must be 255 or fewer characters long.' })
    .regex(/^(https?:\/\/|@)/, { message: 'Wrong format.' }), // TODO: check link format by service
  price: z.coerce.number().min(1, { message: 'Must be greater or equal 1.'}),
  count: z.coerce.number().min(10, { message: 'Must be greater or equal 10.'}),
});

export const editTaskFormSchema = z.object({
  price: z.coerce.number().min(1, { message: 'Must be greater or equal 1.'}),
  count: z.coerce.number().min(10, { message: 'Must be greater or equal 10.'}),
});

export const performerBlockFormSchema = z.object({
  reasons: z.enum([
    BlackListReasonEnum.TASK, 
    BlackListReasonEnum.ACCOUNT, 
    BlackListReasonEnum.BEHAVIOUR, 
    BlackListReasonEnum.OTHER
  ], { message: 'Wrong reason.' })
    .array()
    .nonempty({ message: 'Choose at least one reason.' }),
  comment: z.string().max(5000, { message: 'Must be 5000 or fewer characters long.' }),
});

export const earnTaskReportFormSchema = z.object({
  reasons: z.enum([
    ReportReasonEnum.UNAVAILABLE, 
    ReportReasonEnum.SCAM, 
    ReportReasonEnum.SPAM, 
    ReportReasonEnum.COPYRIGHT, 
    ReportReasonEnum.CONTENT, 
    ReportReasonEnum.OTHER
  ], { message: 'Wrong reason.' })
    .array()
    .nonempty({ message: 'Choose at least one reason.' }),
  comment: z.string().max(5000, { message: 'Must be 5000 or fewer characters long.' }),
});