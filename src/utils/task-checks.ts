'use server'

import { createTaskEarningWithBalanceUpdate, fetchTaskById, fetchTaskDoneCount, taskIsAvailableForUser } from "@/db/query";
import { tgCheckMembershipRequest, tgCheckBoostRequest } from "./tg-requests";
import { Task, User, ServiceActionNameEnum } from '@/lib/definitions';
import { getAuthUser, setSession } from "@/core/session";
import { TaskRelationEnum } from "@/db/schema";

export async function checkTask(taskId: number) {
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

    switch (task.serviceAction?.name) {
      case ServiceActionNameEnum.TELEGRAM_SUBSCRIBE:
        check = await checkTgSubscribe(user.tgId, task.link as string);
        break;
      case ServiceActionNameEnum.TELEGRAM_BOOST:
        check = await checkTgBoost(user.tgId, task.link as string);
        break;
      default:
        check = true; // TODO: return { success: false, message: 'Task is not available.' }
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
  const doneCount = await fetchTaskDoneCount(task.id);
  const done = doneCount + 1 === task.count;

  const { updatedUser } = await createTaskEarningWithBalanceUpdate(
    { userId: user.id, taskId: task.id, profit: task.price },
    user.balance + task.price,
    done
  )
  await setSession(updatedUser); // TODO!?: tx?
}

export async function checkTgSubscribe(tgId: number, channel: string) { // TODO?: add common method checkTg(tgId, channel, action)?
  const data: any = await tgCheckMembershipRequest(tgId, channel);
  const check = !data?.success || data?.result;
  
  return check;
}

export async function checkTgBoost(tgId: number, channel: string) {
  const data: any = await tgCheckBoostRequest(tgId, channel);
  const check = !data?.success || data?.result;
  
  return check;
}