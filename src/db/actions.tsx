'use server'

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; 
import { depositFormSchema, withdrawFormSchema, newTaskFormSchema } from './schema';
import { DepostitFormState, WithdrawFormState, NewTaskFormState} from '@/lib/definitions';
import { getSession, setSession } from '@/app/init-data/auth/session';
import { updateUserById, createTask } from './sql';

export async function DepositFormSubmit(prevState: DepostitFormState, formData: FormData) {
  console.log('DepositFormSubmit');

  try {
    const { user } = await getSession();
    if (!user) {
      throw new Error('Not authorized.');
    }

    const validated = depositFormSchema.safeParse({
      amount: formData.get('amount'),
    });
    console.log('validated:'); console.log(validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to deposit.',
      };
    }

    const { amount } = validated.data;
    const balance = user.balance + amount;

    const updatedUser = await updateUserById(user.id, { balance });
    await setSession(updatedUser);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to update balance.',
    };
  }
  
  revalidatePath('/wallet');
  redirect('/wallet');
}

export async function WithdrawFormSubmit(prevState: WithdrawFormState, formData: FormData) {
  console.log('WithdrawFormSubmit');

  try {
    const { user } = await getSession();
    if (!user) {
      throw new Error('Not authorized.');
    }

    const validated = withdrawFormSchema.safeParse({
      amount: formData.get('amount'),
      address: formData.get('address'),
    });
    console.log('validated:'); console.log(validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to withdraw.',
      };
    }

    const { amount } = validated.data;
    if (user.balance < amount) { // TODO: refactor zod refine?
      return {
        errors: { amount: ['Not enough balance']},
        message: 'Failed to withdraw.',
      }
    }
    const balance = user.balance - amount;

    const updatedUser = await updateUserById(user.id, { balance });
    await setSession(updatedUser);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to update balance.',
    };
  }
  
  revalidatePath('/wallet');
  redirect('/wallet');
}

export async function NewTaskFormSubmit(prevState: NewTaskFormState, formData: FormData) {
  console.log('NewTaskFormSubmit');
  try {
    const { user } = await getSession();
    if (!user) {
      throw new Error('Not authorized.');
    }

    const validated = await newTaskFormSchema.safeParseAsync({
      actionId: formData.get('actionId'),
      serviceId: formData.get('serviceId'),
      link: formData.get('link'),
      price: formData.get('price'),
      count: formData.get('count'),
    });
    console.log('validated:'); console.log(validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to create task.',
      };
    }

    const data = { userId: user.id, ...validated.data };

    const countPrice = data.count * data.price;
    if (user.balance < countPrice) { // TODO: refactor zod refine?
      return {
        errors: { count: ['Lower the count'], price: ['Lower the price']},
        message: `Not enough balance to create task. Need at least $${countPrice}.`,
      }
    }

    await createTask(data);

    // TODO: update balance here? Yep: fix and return if task canceled
    // const balance = user.balance - countPrice;
    // const updatedUser = await updateUserById(user.id, { balance });
    // await setSession(updatedUser);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to create task.',
    };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}