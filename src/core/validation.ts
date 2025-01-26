import { z } from 'zod';
import { fetchActionById, fetchServiceById } from '../db/sql';
import { ReportReasonEnum, BlackListReasonEnum } from '@/lib/definitions';
// import { CurrencyEnum } from '@/lib/definitions';

export const depositFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
});

export const withdrawFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
  address: z.string().length(48, { message: "Wrong address" }),
});


export const createTaskFormSchema = z.object({ // TODO: just check service_action
  actionId: z.coerce.number().positive().refine(async (id) => {
    const action = await fetchActionById(id);
    return !!action?.id;
  }, { message: "Action doesn't exists." }),
  serviceId: z.coerce.number().positive().refine(async (id) => {
    const service = await fetchServiceById(id);
    return !!service?.id;
  }, { message: "Service doesn't exists." }),
  link: z.string()
    .min(3, { message:'Must be 3 or more characters long' })
    .max(255, { message: "Must be 255 or fewer characters long" }),
  price: z.coerce.number().min(1, { message: 'Please enter a price greater or equal 1.'}),
  // currency: z.enum([CurrencyEnum.COIN]), //CurrencyEnum.USDT
  count: z.coerce.number().min(10, { message: 'Please enter a count greater or equal 10.'}), // todo: check balance
});

export const editTaskFormSchema = z.object({
  price: z.coerce.number().min(1, { message: 'Please enter a price greater or equal 1.'}),
  count: z.coerce.number().min(10, { message: 'Please enter a count greater or equal 10.'}), // todo: check balance
});

export const EarnItemReportFormSchema = z.object({
  // taskId: z.coerce.number().positive().refine(async (id) => { // TODO?: pass object with user and task id?
  //   const user: User = await getAuthUser(false); // TODO: decompose object
  //   return await checkUserEarnTask(user.id, id);
  // }, { message: "Wrong task." }),
  reasons: z.enum([
    ReportReasonEnum.UNAVAILABLE, 
    ReportReasonEnum.SCAM, 
    ReportReasonEnum.SPAM, 
    ReportReasonEnum.COPYRIGHT, 
    ReportReasonEnum.CONTENT, 
    ReportReasonEnum.OTHER
  ]).array().nonempty({ message: "Choose at least one reason" }),
  comment: z.string().max(5000, { message: "Must be 5000 or fewer characters long" }),
});

export const PerformerBlockFormSchema = z.object({
  reasons: z.enum([
    BlackListReasonEnum.TASK, 
    BlackListReasonEnum.ACCOUNT, 
    BlackListReasonEnum.BEHAVIOUR, 
    ReportReasonEnum.OTHER
  ]).array().nonempty({ message: "Choose at least one reason" }),
  comment: z.string().max(5000, { message: "Must be 5000 or fewer characters long" }),
});