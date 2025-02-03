'use server'

import { createTaskEarning, fetchTaskById, taskIsAvailableForUser, updateUserWithSession } from "@/db/query";
import { tgCheckBoostRequest, tgCheckMembershipRequest } from "./requests";
import { Task, User, ServiceActionName } from '@/lib/definitions';
import { getAuthUser } from "@/app/auth/session";
import { TaskRelationEnum } from "@/db/schema";


// TODO?: check if user already done task?
export async function checkTask(taskId: number) {
  console.log('checkTask');

  try {
    const [user, task] = await Promise.all([
      getAuthUser(false), 
      fetchTaskById(taskId, [TaskRelationEnum.SERVICE_ACTION]), 
    ]);

    let check = false;

    const available = await taskIsAvailableForUser(task.id, user.id);

    if (!available) {
      throw new Error('Task is not available.');
    }

    switch (task.serviceAction?.name) { // TODO: link to channel format
      case ServiceActionName.TELEGRAM_SUBSCRIBE:
        check = await checkTgSubscribe(user.tgId, task.link as string);
        break;
      case ServiceActionName.TELEGRAM_BOOST:
        check = await checkTgBoost(user.tgId, task.link as string);
        break;
      default:
        console.log(`Couldn't find checker for task.`);
    }
    console.log('checkTask check:', check);

    if (check) { 
      await earnOnTask(task, user);
    }

    return check;
  } catch (error) {
    console.log('Check failed! Error:', error);
    return false;
  }
  // revalidatePath('/earn?tab=quests');
  // redirect('/earn?tab=quests');
}

export async function earnOnTask(task: Task, user: User) { // TODO!!: db transaction
  console.log('earnOnTask');
  const questEarningId = await createTaskEarning({ userId: user.id, taskId: task.id, profit: task.price });

  if (questEarningId) {
    const balance = user.balance + task.price;
    await updateUserWithSession(user.id, { balance });
  }
}


export async function checkTgSubscribe(tgId: number, channel: string) {
  console.log('checkTgSubscribe');
  let check = false;
  try {
    const data: any = await tgCheckMembershipRequest(tgId, channel);
    check = data?.success && data?.result;
  } catch (error) {
    console.log(error);
  }
  return check;
}

export async function checkTgBoost(tgId: number, channel: string) {
  console.log('checkTgBoost');
  let check = false;
  try {
    const data: any = await tgCheckBoostRequest(tgId, channel);
    check = data?.success && data?.result;
  } catch (error) {
    console.log(error);
  }
  return check;
}