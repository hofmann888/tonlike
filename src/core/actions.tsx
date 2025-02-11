'use server'

import { updateUserWithSession, updateTask, userHasTask, deleteTask, hideTaskEarningForUser, taskIsAvailableForUser, createReport, fetchTaskPerformers, userInBlackList, addUserToBlackList, removeUserFromBlackList, fetchTaskById, createTaskWithBalanceUpdate, updateTaskWithBalance } from '../db/query';
import { DepostitFormState, WithdrawFormState, CreateTaskFormState, EditTaskFormState, User, TaskStatus, TaskStatusEnum, EarnItemReportFormState, PerformerBlockFormState } from '@/lib/definitions';
import { depositFormSchema, withdrawFormSchema, createTaskFormSchema, editTaskFormSchema, EarnItemReportFormSchema, PerformerBlockFormSchema } from './validation';
import { getAuthUser, setSession } from '@/app/auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; 

// TODO: rename form-actions

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

    await updateUserWithSession(user.id, { balance });
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

    await updateUserWithSession(user.id, { balance });
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
      serviceActionId: formData.get('serviceActionId'),
      link: formData.get('link'),
      price: formData.get('price'),
      count: formData.get('count'),
      // serviceId: formData.get('serviceId'),
      // actionId: formData.get('actionId'),
      // currency: formData.get('currency'),
    });
    console.log('validated:', validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to create task.',
      };
    }

    const data = { userId: user.id, ...validated.data };
    const sum = data.count * data.price;

    if (user.balance < sum) { // TODO: refactor zod refine?
      return {
        errors: { count: ['Lower the count'], price: ['Lower the price']},
        message: `Not enough balance to create task. Need at least $${sum}.`,
      }
    }

    const { updatedUser } = await createTaskWithBalanceUpdate(data, user.balance - sum);
    await setSession(updatedUser); // TODO?: move to tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to create task.',
    };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function EditTaskFormSubmit(taskId: number, prevState: EditTaskFormState, formData: FormData) {
  console.log('EditTaskFormSubmit');
  try {
    const user: User = await getAuthUser(false);

    const validated = await editTaskFormSchema.safeParseAsync({
      price: formData.get('price'),
      count: formData.get('count'),
    });
    console.log('validated:', validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to edit task.',
      };
    }

    if (!await userHasTask(taskId, user.id)) {
      throw new Error("Wrong task!");
    }

    const data = validated.data;
    const task = await fetchTaskById(taskId);
    const reserve = Number(user.balance) + task.price * task.count - task.price * task.done;
    const sum = data.count * data.price;

    if (data.count < task.count) { // TODO: refactor zod refine?
      return {
        errors: { count: ['Too low count']},
        message: `Count can't be less than progress.`,
      }
    }

    if (reserve < sum) { // TODO: refactor zod refine?
      return {
        errors: { count: ['Lower the count'], price: ['Lower the price']},
        message: `Not enough balance to create task. Need at least $${sum - reserve}.`,
      }
    }

    // TODO: peredelat' viser etot...po horoshemu bi na classi eto vse perepisat'
    const { updatedUser } = await updateTaskWithBalance(taskId, { price: data.price, count: data.count }, user.id, reserve - sum);
    await setSession(updatedUser);
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
      await updateTask(taskId, { status });
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

export async function PerformerBlockFormSubmit(blockUserId: number, prevState: PerformerBlockFormState, formData: FormData) {
  console.log('PerformerBlockFormSubmit');
  try {
    const user: User = await getAuthUser(false);

    console.log('formData', formData);

    const validated = PerformerBlockFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });

    if (!validated.success) {
      console.log('errors', validated.error.flatten().fieldErrors);
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to block user.',
        success: false
      };
    }

    // if (!await userHasTask(taskId, user.id)) { // TODO!?: do i need this?
    //   throw new Error("Wrong task!");
    // }

    if (await userInBlackList(user.id, blockUserId)) {
      throw new Error("Can't block user!");
    }

    const data = { userId: user.id, blockedUserId: blockUserId, ...validated.data };

    await addUserToBlackList(data);
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to block user.',
      success: false
    };
  }
  return { success: true }; // TODO: check with revalidatePath and redirect
  // revalidatePath('/tasks');
  // redirect('/tasks');
}

export async function PerformerUnblock(unblockUserId: number) { // TODO?: UnblockUser?
  console.log('HideUserEarnTask');
  try {
    const user: User = await getAuthUser(false);
    
    const result = await removeUserFromBlackList(user.id, unblockUserId);
    if (!result) {
      throw new Error('Wrong unblockUserId!');
    }
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to unblock user.',
      success: false,
    };
  }
  return { success: true };
}

export async function HideUserEarnTask(taskId: number) {
  console.log('HideUserEarnTask');
  try {
    const user: User = await getAuthUser(false);

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error("Wrong task!");
    }
    
    await hideTaskEarningForUser(user.id, taskId);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to hide task.',
      success: false,
    };
  }
}
// TODO?: EarnTask
export async function EarnItemReportFormSubmit(taskId: number, prevState: EarnItemReportFormState, formData: FormData) {
  console.log('ReportUserEarnTask');

  try {
    const user: User = await getAuthUser(false);

    const validated = EarnItemReportFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });
    
    if (!validated.success) {
      console.log('errors', validated.error.flatten().fieldErrors);
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to report task.',
        success: false
      };
    }

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error("Wrong task!");
    }

    const data = { userId: user.id, taskId: taskId, ...validated.data };
    await createReport(data);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Operation Error: Failed to report task.',
      success: false
    };
  }
}

