import { z } from 'zod';
import { fetchActionById, fetchServiceById } from './sql';

export const depositFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
});

export const withdrawFormSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Please enter an amount greater or equal $1.'}),
  address: z.string().length(48, { message: "Wrong address" }),
});


export const newTaskFormSchema = z.object({
  actionId: z.coerce.number().positive().refine(async (id) => {
    const action = await fetchActionById(id);
    if (!action?.id) {
      return false;
    }
    return true;
  }, { message: "Action doesn't exists." }),
  serviceId: z.coerce.number().positive().refine(async (id) => {
      const service = await fetchServiceById(id);
      if (!service?.id) {
        return false;
      }
      return true;
    }, { message: "Service doesn't exists." }),
  link: z.string()
    .min(3, { message:'Must be 3 or more characters long' })
    .max(255, { message: "Must be 255 or fewer characters long" }),
  price: z.coerce.number().min(0.01, { message: 'Please enter a price greater or equal $0.01.'}),
  count: z.coerce.number().min(10, { message: 'Please enter a count greater or equal 10.'}), // todo: check balance
});








// export const userSchema = z.object({
//   id: z.bigint().positive(),
//   tg_id: z.bigint().positive(),
//   address: z.string().length(48, { message: "Wrong address" }),
// 	balance: z.number().positive(),
// 	reward: z.number().positive(),
// });