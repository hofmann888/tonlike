import { z } from 'zod';
import { fetchServiceActionById } from '@/db/query';
import { ReportReasonEnum, BlackListReasonEnum, TaskStatusEnum } from '@/lib/definitions';
import { ServiceActionsRelationsEnum } from '@/db/schema';
// import { CurrencyEnum } from '@/lib/definitions';

export const depositFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
});

export const withdrawFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
  address: z.string().length(48, { message: "Wrong address." }),
});

export const createTaskFormSchema = z.object({
  serviceActionId: z.coerce.number()
    .positive({ message: 'Wrong action.' })
    .refine(async (id) => {
      const serviceAction = await fetchServiceActionById(id, [ServiceActionsRelationsEnum.ACTION, ServiceActionsRelationsEnum.SERVICE]);
      return serviceAction && serviceAction.active && serviceAction.service?.active && serviceAction.action?.active;
    }, { message: 'Wrong action.' }),
  link: z.string()
    .min(3, { message: 'Must be 3 or more characters long.' })
    .max(255, { message: 'Must be 255 or fewer characters long.' })
    .regex(/^(https?:\/\/|@)/, { message: 'Wrong format.' }), // TODO: check link format by service
  price: z.coerce.number().min(1, { message: 'Must be greater or equal 1.'}),
  count: z.coerce.number().min(10, { message: 'Must be greater or equal 10.'}),
  // actionId: z.coerce.number().positive().refine(async (id) => {
  //   const action = await fetchActionById(id);
  //   return !!action?.id;
  // }, { message: "Action doesn't exists." }),
  // serviceId: z.coerce.number().positive().refine(async (id) => {
  //   const service = await fetchServiceById(id);
  //   return !!service?.id;
  // }, { message: "Service doesn't exists." }),
  // currency: z.enum([CurrencyEnum.COIN]), //CurrencyEnum.USDT
});

export const editTaskFormSchema = z.object({
  price: z.coerce.number().min(1, { message: 'Must be greater or equal 1.'}),
  count: z.coerce.number().min(10, { message: 'Must be greater or equal 10.'}),
});

export const earnItemReportFormSchema = z.object({
  reasons: z.enum([
    ReportReasonEnum.UNAVAILABLE, 
    ReportReasonEnum.SCAM, 
    ReportReasonEnum.SPAM, 
    ReportReasonEnum.COPYRIGHT, 
    ReportReasonEnum.CONTENT, 
    ReportReasonEnum.OTHER
  ], { message: 'Wrong reason.' })
    .array()
    .nonempty({ message: "Choose at least one reason." }),
  comment: z.string().max(5000, { message: "Must be 5000 or fewer characters long." }),
  // taskId: z.coerce.number().positive().refine(async (id) => { // TODO?: pass object with user and task id?
  //   const user: User = await getAuthUser(false, true); // TODO: decompose object
  //   return await checkUserEarnTask(user.id, id);
  // }, { message: "Wrong task." }),
});

export const performerBlockFormSchema = z.object({
  reasons: z.enum([
    BlackListReasonEnum.TASK, 
    BlackListReasonEnum.ACCOUNT, 
    BlackListReasonEnum.BEHAVIOUR, 
    BlackListReasonEnum.OTHER
  ], { message: 'Wrong reason.' })
    .array()
    .nonempty({ message: "Choose at least one reason." }),
  comment: z.string().max(5000, { message: "Must be 5000 or fewer characters long." }),
});