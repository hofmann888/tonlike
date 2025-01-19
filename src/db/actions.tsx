'use server'

import { updateUserById, createTask, updateTaskStatus, userHasTask, deleteTask, hideUserEarning, checkUserEarnTask, createReport, fetchTaskPerformers } from './sql';
import { DepostitFormState, WithdrawFormState, CreateTaskFormState, User, TaskStatus, TaskStatusEnum, EarnItemReportFormState } from '@/lib/definitions';
import { depositFormSchema, withdrawFormSchema, createTaskFormSchema, EarnItemReportFormSchema } from './schema';
import { getAuthUser, setSession } from '@/app/auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; 

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
      // currency: formData.get('currency'),
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

// TODO?: EarnTask
export async function EarnItemReportFormSubmit(taskId: number, prevState: EarnItemReportFormState, formData: FormData) {
  console.log('ReportUserEarnTask');

  try {
    const user: User = await getAuthUser(false);

    console.log('formData:', formData);

    const validated = EarnItemReportFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });
    console.log('validated:', validated);

    
    if (!validated.success) {
      console.log('errors', validated.error.flatten().fieldErrors);
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to report task.',
        success: false
      };
    }

    if (!await checkUserEarnTask(user.id, taskId)) {
      throw new Error("Wrong task!");
    }

    const data = { userId: user.id, taskId: taskId, ...validated.data };

    await createReport(data);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to report task.',
      success: false
    };
  }
  return { success: true };
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

export async function GetTaskPerformers(taskId: number) {
  console.log('GetTaskPerformers');
  try {
    const user: User = await getAuthUser(false);

    if (!await userHasTask(taskId, user.id)) {
      throw new Error("Wrong task!");
    }

    const data = await fetchTaskPerformers(taskId);
    return { data };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to update task.',
    };
  }
}

export async function HideUserEarnTask(taskId: number) {
  console.log('HideUserEarnTask');
  try {
    const user: User = await getAuthUser(false);

    if (!await checkUserEarnTask(user.id, taskId)) {
      throw new Error("Wrong task!");
    }
    
    return await hideUserEarning(user.id, taskId);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to hide task.',
    };
  }
  // revalidatePath('/tasks');
  // redirect('/tasks');
}