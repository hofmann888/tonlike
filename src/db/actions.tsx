'use server'

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; 
import { updateUserById, createTask, updateTaskStatus, userHasTask, deleteTask } from './sql';
import { getAuthUser, setSession } from '@/app/auth/session';
import { depositFormSchema, withdrawFormSchema, createTaskFormSchema } from './schema';
import { DepostitFormState, WithdrawFormState, CreateTaskFormState, User, TaskStatus, TaskStatusEnum} from '@/lib/definitions';

export async function DepositFormSubmit(prevState: DepostitFormState, formData: FormData) {
  console.log('DepositFormSubmit');

  try {
    const user: User = await getAuthUser(false);

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
    const user: User = await getAuthUser(false);

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

export async function CreateTaskFormSubmit(prevState: CreateTaskFormState, formData: FormData) {
  console.log('CreateTaskFormSubmit');
  try {
    const user: User = await getAuthUser(false);

    const validated = await createTaskFormSchema.safeParseAsync({
      actionId: formData.get('actionId'),
      serviceId: formData.get('serviceId'),
      link: formData.get('link'),
      price: formData.get('price'),
      count: formData.get('count'),
    });
    console.log('validated:', validated);

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


export async function ChangeTaskStatus(taskId: number, status: TaskStatus) {
  console.log('ChangeTaskStatus');
  try {
    const user: User = await getAuthUser(false);

    if (!await userHasTask(taskId, user.id)) {
      throw new Error("Wrong task!");
    }

    if (status === TaskStatusEnum.DELETED) { // TODO: seperate action for delete?
      await deleteTask(taskId);
    } else {
      await updateTaskStatus(taskId, status);
    }
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to update task.',
    };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}