'use server'

// TODO: import * as query from "@/db/query";
import { updateUserWithSession, updateTask, userHasTask, hideTaskEarningForUser, taskIsAvailableForUser, createReport, fetchTaskPerformers, userInBlackList, addUserToBlackList, removeUserFromBlackList, fetchTaskById, createTaskWithBalanceUpdate, updateTaskWithBalance, isTaskExists, fetchTaskDoneSum, fetchTaskDoneCount, fetchUserReferralsCount, fetchUserReferralsTaskEarningsSum, fetchServiceActionById } from '../db/query';
import { CreateTaskFormState, EditTaskFormState, User, TaskStatus, TaskStatusEnum, EarnTaskReportFormState, PerformerBlockFormState, ServiceName } from '@/lib/definitions';
import { createTaskFormSchema, editTaskFormSchema, earnTaskReportFormSchema, performerBlockFormSchema, formatErrors } from './validation';
import { ServiceActionsRelationsEnum } from '@/db/schema';
import { getAuthUser, setSession } from '@/core/session';
import { getTranslations } from 'next-intl/server';
import { formatLink } from '@/utils/helpers';
import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { sql } from 'drizzle-orm';

// TODO: format zod validated errors for i18n and heroUI
// TODO: actions -> server-actions

export async function CreateTaskFormSubmit(prevState: CreateTaskFormState, formData: FormData) {
  const t = await getTranslations('messages.serverActions.CreateTaskFormSubmit');

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
        errors: await formatErrors(validated.error.flatten().fieldErrors),
        message: t('failed'),
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
        errors: await formatErrors({ price: ['createTaskForm.price.high'] }),
        message: t('balance', { sum: sum }),
      }
    }

    if (await isTaskExists(data.userId, data.serviceActionId, data.link)) {
      return { message: t('exists') }
    }

    const { updatedUser } = await createTaskWithBalanceUpdate(data, user.balance - sum);
    await setSession(updatedUser); // TODO!?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function EditTaskFormSubmit(taskId: number, prevState: EditTaskFormState, formData: FormData) {
  const t = await getTranslations('messages.serverActions.EditTaskFormSubmit');

  try {
    const user: User = await getAuthUser(false, true);

    const validated = await editTaskFormSchema.safeParseAsync({
      price: formData.get('price'),
      count: formData.get('count'),
    });

    if (!validated.success) {
      return {
        errors: await formatErrors(validated.error.flatten().fieldErrors),
        message: t('failed'),
      };
    }

    const [task, hasTask, doneCount, doneSum] = await Promise.all([
      fetchTaskById(taskId),
      userHasTask(taskId, user.id),
      fetchTaskDoneCount(taskId),
      fetchTaskDoneSum(taskId),
    ]);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(task.status)) {
      throw new Error(t('status'));
    }

    if (!hasTask) {
      throw new Error(t('task'));
    }

    const data = validated.data;
    data.count = Math.floor(Number(data.count));
    data.price = Math.floor(Number(data.price));

    if (data.count < doneCount) { // TODO?: refactor zod refine?
      return {
        errors: await formatErrors({ count: ['editTaskForm.count.low'] }),
        message: t('count'),
      }
    }

    const sum = task.price * (task.count - doneCount) + doneSum;
    const newSum = data.price * (data.count - doneCount) + doneSum;
    const cost = newSum - doneSum;
    const reserve = Number(user.balance) + sum - doneSum;
    const newBalance = reserve - cost;

    if (newBalance < 0) { // TODO?: refactor zod refine?
      return {
        errors: await formatErrors({ price: ['editTaskForm.price.high'] }),
        message: t('balance', { sum: cost - reserve }), // TODO: dynamic currency - coin|$
      }
    }

    const { updatedUser } = await updateTaskWithBalance(taskId, { price: data.price, count: data.count }, user.id, newBalance); // TODO!: refactor
    await setSession(updatedUser); // TODO!?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
  }
  
  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function ChangeTaskStatus(taskId: number, status: TaskStatus) {
  const t = await getTranslations('messages.serverActions.ChangeTaskStatus');

  try {
    const user: User = await getAuthUser(false, true);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(status)) {
      throw new Error(t('status'));
    }

    if (!await userHasTask(taskId, user.id)) {
      throw new Error(t('task'));
    }

    await updateTask(taskId, { status });
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function DeleteTask(taskId: number) {
  const t = await getTranslations('messages.serverActions.DeleteTask');

  try {
    const user: User = await getAuthUser(false, true);

    const [task, hasTask, doneCount] = await Promise.all([
      fetchTaskById(taskId),
      userHasTask(taskId, user.id),
      fetchTaskDoneCount(taskId),
      fetchTaskDoneSum(taskId),
    ]);

    if ([TaskStatusEnum.DELETED, TaskStatusEnum.DONE].includes(task.status)) {
      throw new Error(t('status'));
    }

    if (!hasTask) {
      throw new Error(t('task'));
    }
 
    const newBalance = user.balance + task.price * (task.count - doneCount);

    // await deleteTask(taskId);
    const { updatedUser } = await updateTaskWithBalance(taskId, { status: TaskStatusEnum.DELETED, deletedAt: sql`NOW()` }, user.id, newBalance); // TODO!: refactor
    await setSession(updatedUser); // TODO?: tx?
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
  }

  revalidatePath('/tasks');
  redirect('/tasks');
}

export async function GetTaskPerformers(taskId: number) {
  const t = await getTranslations('messages.serverActions.GetTaskPerformers');

  try {
    const user: User = await getAuthUser(false, true);

    if (!await userHasTask(taskId, user.id)) {
      throw new Error(t('task'));
    }

    const data = await fetchTaskPerformers(taskId);
    return { data };
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
  }
}

export async function PerformerBlockFormSubmit(blockUserId: number, prevState: PerformerBlockFormState, formData: FormData) {
  const t = await getTranslations('messages.serverActions.PerformerBlockFormSubmit');

  try {
    const user: User = await getAuthUser(false, true);

    const validated = performerBlockFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });

    if (!validated.success) {
      return {
        errors: await formatErrors(validated.error.flatten().fieldErrors),
        message: t('failed'),
        success: false
      };
    }

    if (await userInBlackList(user.id, blockUserId)) {
      throw new Error(t('user'));
    }

    const data = { userId: user.id, blockedUserId: blockUserId, ...validated.data };
    await addUserToBlackList(data);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: t('failed'),
      success: false
    };
  }
}

export async function PerformerUnblock(unblockUserId: number) { // TODO?: UnblockUser?
  const t = await getTranslations('messages.serverActions.PerformerUnblock');

  try {
    const user: User = await getAuthUser(false, true);
    
    const result = await removeUserFromBlackList(user.id, unblockUserId);
    if (!result) {
      throw new Error(t('user'));
    }

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: t('failed'),
      success: false,
    };
  }
}

export async function HideUserEarnTask(taskId: number) {
  const t = await getTranslations('messages.serverActions.HideUserEarnTask');

  try {
    const user: User = await getAuthUser(false, true);

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error(t('task'));
    }

    await hideTaskEarningForUser(taskId, user.id);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: t('failed'),
      success: false,
    };
  }
}

export async function EarnTaskReportFormSubmit(taskId: number, prevState: EarnTaskReportFormState, formData: FormData) {
  const t = await getTranslations('messages.serverActions.EarnTaskReportFormSubmit');

  try {
    const user: User = await getAuthUser(false, true);

    const validated = earnTaskReportFormSchema.safeParse({
      reasons: formData.getAll('reasons'),
      comment: formData.get('comment'),
    });
    
    if (!validated.success) {
      return {
        errors: await formatErrors(validated.error.flatten().fieldErrors),
        message: t('failed'),
        success: false
      };
    }

    if (!await taskIsAvailableForUser(taskId, user.id)) {
      throw new Error(t('task'));
    }

    const data = { userId: user.id, taskId: taskId, ...validated.data };
    await createReport(data);

    return { success: true };
  } catch (error) {
    console.log('Operation Error:', error);
    return {
      message: t('failed'),
      success: false
    };
  }
}

export async function ClaimReferralEarnings() {
  const t = await getTranslations('messages.serverActions.ClaimReferralEarnings');

  try {
    const user: User = await getAuthUser(false, true);

    const [referralsCount, sum] = await Promise.all([
      fetchUserReferralsCount(user.id),
      fetchUserReferralsTaskEarningsSum(user.id),
    ]);

    const profit = Math.round(referralsCount * 1000 + sum / 10); // TODO: vinesty 1000 somewhere
    const claimSum = profit - user.claimed;

    if (!claimSum) {
      return { message: t('claimed') };
    }

    await updateUserWithSession(user.id, { 
      balance: user.balance + claimSum, 
      claimed: user.claimed + claimSum,
    });
  } catch (error) {
    console.log('Operation Error:', error);
    return { message: t('failed') };
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