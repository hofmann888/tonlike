'use server'

import { createTaskEarningWithBalanceUpdate, fetchTaskById, fetchTaskDoneCount, taskIsAvailableForUser } from "@/db/query";
import { tgCheckBoostRequest, tgCheckMembershipRequest } from "./requests";
import { Task, User, ServiceActionName } from '@/lib/definitions';
import { getAuthUser, setSession } from "@/app/auth/session";
import { TaskRelationEnum } from "@/db/schema";

export async function checkTask(taskId: number) {
  console.log('checkTask');
  try {
    const [user, task] = await Promise.all([
      getAuthUser(false, true), 
      fetchTaskById(taskId, [TaskRelationEnum.SERVICE_ACTION]), 
    ]);

    const available = await taskIsAvailableForUser(task.id, user.id);
    if (!available) {
      return { 
        success: false, 
        message: 'Task is not available.',
      }
    }

    let check = false;

    switch (task.serviceAction?.name) { // TODO: link to channel format
      case ServiceActionName.TELEGRAM_SUBSCRIBE:
        check = await checkTgSubscribe(user.tgId, task.link as string);
        break;
      case ServiceActionName.TELEGRAM_BOOST:
        check = await checkTgBoost(user.tgId, task.link as string);
        break;
      default:
        check = true;
        // return {
        //   success: false,
        //   message: 'Task is not available.',
        // }
    }

    check && await earnOnTask(task, user);

    return { 
      success: check,
      message: check ? 'Task completed.' : 'Check failed.',
    };
  } catch (error) {
    console.log('Check Error:', error);
    return { 
      success: false, 
      message: 'Try again.',
    };
  }
}

export async function earnOnTask(task: Task, user: User) {
  console.log('earnOnTask');
  const doneCount = await fetchTaskDoneCount(task.id);
  const done = doneCount + 1 === task.count;

  const { updatedUser } = await createTaskEarningWithBalanceUpdate(
    { userId: user.id, taskId: task.id, profit: task.price },
    user.balance + task.price,
    done
  )

  await setSession(updatedUser); // TODO: what if error? mb use transaction and make rollback on this too?
}

export async function checkTgSubscribe(tgId: number, channel: string) {
  console.log('checkTgSubscribe');
  const data: any = await tgCheckMembershipRequest(tgId, channel);
  const check = data?.success && data?.result;
  
  return check;
}

export async function checkTgBoost(tgId: number, channel: string) {
  console.log('checkTgBoost');
  const data: any = await tgCheckBoostRequest(tgId, channel);
  const check = data?.success && data?.result;
  
  return check;
}