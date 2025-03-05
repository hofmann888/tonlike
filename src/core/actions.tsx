'use server'

// TODO: import * as query from "@/db/query";
import { updateUserWithSession, updateTask, userHasTask, hideTaskEarningForUser, taskIsAvailableForUser, createReport, fetchTaskPerformers, userInBlackList, addUserToBlackList, removeUserFromBlackList, fetchTaskById, createTaskWithBalanceUpdate, updateTaskWithBalance, isTaskExists, fetchTaskDoneSum, fetchTaskDoneCount, fetchUserReferralsCount, fetchUserReferralsTaskEarningsSum, fetchServiceActionById } from '../db/query';
import { CreateTaskFormState, EditTaskFormState, User, TaskStatus, TaskStatusEnum, EarnTaskReportFormState, PerformerBlockFormState, ServiceName } from '@/lib/definitions';
import { createTaskFormSchema, editTaskFormSchema, earnTaskReportFormSchema, performerBlockFormSchema } from './validation';
import { ServiceActionsRelationsEnum } from '@/db/schema';
import { getAuthUser, setSession } from '@/core/session';
import { formatLink } from '@/utils/helpers';
import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { sql } from 'drizzle-orm';

export async function CreateTaskFormSubmit(prevState: CreateTaskFormState, formData: FormData) {
  try {
    const user: User = await getAuthUser(false, true);

    const validated = await createTaskFormSchema.safeParseAsync({
      serviceActionId: formData.get('serviceActionId'),
      link: formData.get('link'),
      price: formData.get('price'),
      count: formData.get('count'),
    });

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to create task.',
      };
    }

    const serviceAction = await fetchServiceActionById(validated.data.serviceActionId, [ServiceActionsRelationsEnum.ACTION, ServiceActionsRelationsEnum.SERVICE]);
    
    const data = { userId: user.id, ...validated.data };
    data.link = formatLink(data.link, serviceAction.service?.name as ServiceName, 'link'); // TODO?
    data.count = Math.floor(Number(data.count));
    data.price = Math.floor(Number(data.price));
    const sum = data.count * data.price;
    
    if (user.balance < sum) { // TODO?: refactor zod refine?
      return {
        errors: { price: ['Lower the price'] },
        message: `Not enough balance to create task. Need at least $${sum}.`,
      }
    }

    if (await isTaskExists(data.userId, data.serviceActionId, data.link)) {
      return { message: 'Task already exists.' }
    }

    const { updatedUser } = await createTaskWithBalanceUpdate(data, user.balance - sum);
    await setSession(updatedUser); // TODO!?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: 'Failed to create task.' };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function EditTaskFormSubmit(taskId: number, prevState: EditTaskFormState, formData: FormData) {
  try {
    const user: User = await getAuthUser(false, true);

    const validated = await editTaskFormSchema.safeParseAsync({
      price: formData.get('price'),
      count: formData.get('count'),
    });

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to update task.',
      };
    }

    const [task, hasTask, doneCount, doneSum] = await Promise.all([
      fetchTaskById(taskId),
      userHasTask(taskId, user.id),
      fetchTaskDoneCount(taskId),
      fetchTaskDoneSum(taskId),
    ]);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(task.status)) {
      throw new Error('Wrong status.');
    }

    if (!hasTask) {
      throw new Error('Wrong task.');
    }

    const data = validated.data;
    data.count = Math.floor(Number(data.count));
    data.price = Math.floor(Number(data.price));

    if (data.count < doneCount) { // TODO?: refactor zod refine?
      return {
        errors: { count: ['Too low count'] },
        message: `Count can't be less than progress.`,
      }
    }

    const sum = task.price * (task.count - doneCount) + doneSum;
    const newSum = data.price * (data.count - doneCount) + doneSum;
    const cost = newSum - doneSum;
    const reserve = Number(user.balance) + sum - doneSum;
    const newBalance = reserve - cost;

    if (newBalance < 0) { // TODO?: refactor zod refine?
      return {
        errors: { price: ['Lower the price'] },
        message: `Not enough balance to update task. Need at least $${cost - reserve}.`, // TODO: dynamic currency - coin|$
      }
    }

    const { updatedUser } = await updateTaskWithBalance(taskId, { price: data.price, count: data.count }, user.id, newBalance); // TODO!: refactor
    await setSession(updatedUser); // TODO!?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: 'Failed to update task.' };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function ChangeTaskStatus(taskId: number, status: TaskStatus) {
  try {
    const user: User = await getAuthUser(false, true);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(status)) {
      throw new Error('Wrong status.');
    }

    if (!await userHasTask(taskId, user.id)) {
      throw new Error('Wrong task.');
    }

    await updateTask(taskId, { status });
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: 'Failed to update task.' };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function DeleteTask(taskId: number) {
  try {
    const user: User = await getAuthUser(false, true);

    const [task, hasTask, doneCount] = await Promise.all([
      fetchTaskById(taskId),
      userHasTask(taskId, user.id),
      fetchTaskDoneCount(taskId),
      fetchTaskDoneSum(taskId),
    ]);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(task.status)) {
      throw new Error('Wrong status.');
    }

    if (!hasTask) {
      throw new Error('Wrong task.');
    }
 
    const newBalance = user.balance + task.price * (task.count - doneCount);

    // await deleteTask(taskId);
    const { updatedUser } = await updateTaskWithBalance(taskId, { status: TaskStatusEnum.DELETED, deletedAt: sql`NOW()` }, user.id, newBalance); // TODO!: refactor
    await setSession(updatedUser); // TODO?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: 'Failed to delete task.' };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function GetTaskPerformers(taskId: number) {
  try {
    const user: User = await getAuthUser(false, true);

    if (!await userHasTask(taskId, user.id)) {
      throw new Error("Wrong task!");
    }

    const data = await fetchTaskPerformers(taskId);
    return { data };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Failed to fetch data.',
    };
  }
}

export async function PerformerBlockFormSubmit(blockUserId: number, prevState: PerformerBlockFormState, formData: FormData) {
  try {
    const user: User = await getAuthUser(false, true);

    const validated = performerBlockFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to block user.',
        success: false
      };
    }

    if (await userInBlackList(user.id, blockUserId)) {
      throw new Error('User already blocked.');
    }

    const data = { userId: user.id, blockedUserId: blockUserId, ...validated.data };
    await addUserToBlackList(data);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Failed to block user.',
      success: false
    };
  }
}

export async function PerformerUnblock(unblockUserId: number) { // TODO?: UnblockUser?
  try {
    const user: User = await getAuthUser(false, true);
    
    const result = await removeUserFromBlackList(user.id, unblockUserId);
    if (!result) {
      throw new Error('Wrong user.');
    }

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Failed to unblock user.',
      success: false,
    };
  }
}

export async function HideUserEarnTask(taskId: number) {
  try {
    const user: User = await getAuthUser(false, true);

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error('Wrong task.');
    }

    await hideTaskEarningForUser(taskId, user.id);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Failed to hide task.',
      success: false,
    };
  }
}

export async function EarnTaskReportFormSubmit(taskId: number, prevState: EarnTaskReportFormState, formData: FormData) {
  try {
    const user: User = await getAuthUser(false, true);

    const validated = earnTaskReportFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });
    
    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to report task.',
        success: false
      };
    }

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error('Wrong task.');
    }

    const data = { userId: user.id, taskId: taskId, ...validated.data };
    await createReport(data);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: 'Failed to report task.',
      success: false
    };
  }
}

export async function ClaimReferralEarnings() {
  try {
    const user: User = await getAuthUser(false, true);

    const [referralsCount, sum] = await Promise.all([
      fetchUserReferralsCount(user.id),
      fetchUserReferralsTaskEarningsSum(user.id),
    ]);

    const profit = Math.round(referralsCount * 1000 + sum / 10); // TODO: vinesty 1000 somewhere
    const claimSum = profit - user.claimed;

    if (!claimSum) {
      return { message: 'Already claimed.' };
    }

    await updateUserWithSession(user.id, { 
      balance: user.balance + claimSum, 
      claimed: user.claimed + claimSum,
    });
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: 'Something went wrong. Try again.' };
  }

  revalidatePath('/referrals');
  redirect('/referrals');
}

export async function HideEarnWaning(dontShow: boolean = false) {
  const expiresIn = dontShow ? 365 * 24 * 60 * 60 : 24 * 60 * 60;
  const expires = Date.now() + expiresIn * 1000;

  cookies().set({ 
    name: 'earnWarningHide',
    value: '1',
    sameSite: 'none',
    secure: true,
    expires: expires,
  });
}

export async function clearHideEarnWaningCookie() {
  cookies().delete('earnWarningHide');
}