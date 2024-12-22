import { z } from 'zod';

export const depositFormSchema = z.object({
  amount: z.coerce
    .number()
    .gt(1, { message: 'Please enter an amount greater than $1.'}),
});

export const withdrawFormSchema = z.object({
  amount: z.coerce
    .number()
    .gt(1, { message: 'Please enter an amount greater than $1.'}),
  address: z.string().length(48, { message: "Wrong address" }),
});

export const userSchema = z.object({
  id: z.bigint().positive(),
  tg_id: z.bigint().positive(),
  address: z.string().length(48, { message: "Wrong address" }),
	balance: z.number().positive(),
	reward: z.number().positive(),
});