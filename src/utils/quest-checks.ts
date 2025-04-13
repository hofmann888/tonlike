'use server'

import { fetchLastDateUserDoneQuest, fetchQuestById, fetchTaskEarningLastDoneByUserId, fetchUserReferralsCount, fetchTaskEarningDoneCountByUserId, fetchQuestDoneCountByUserId, fetchTaskCountByUserId, createQuestEarningWithBalanceUpdate, fetchQuestDoneCountTodayByUserAndQuestId } from "@/db/query";
import { Quest, User, ServiceActionNameEnum } from '@/lib/definitions';
import { checkTgSubscribe, checkTgBoost } from "./task-checks";
import { getAuthUser, setSession } from "@/core/session";
import { getTranslations } from "next-intl/server";
import { QuestRelationEnum } from "@/db/schema";
import { checkDailyDone } from "./helpers";

// TODO: refactor on class oop

export async function checkQuest(questId: number, checkExt?: boolean) {
  const t = await getTranslations('messages.checks.quest');

  try {
    const [user, quest] = await Promise.all([
      getAuthUser(false, true), 
      fetchQuestById(questId, [QuestRelationEnum.SERVICE_ACTION]), 
    ]);

    const questDone = await checkQuestDone(quest, user);
    if (questDone) {
      return { 
        success: false, 
        message: t('alreadyCompleted'),
      }
    }
    
    let check = false;
  
    switch (quest.serviceAction.name) {
      case ServiceActionNameEnum.APP_CHECK_IN:
        check = true;
        break;
      case ServiceActionNameEnum.APP_AD:
        check = checkExt ?? check;
        break;
      case ServiceActionNameEnum.APP_INVITE:
        check = await checkInvitedCount(user.id, quest.countPerUser);
        break;
      case ServiceActionNameEnum.APP_QUEST_DONE:
        check = await checkQuestDoneCount(user.id, quest.countPerUser);
        break;
      case ServiceActionNameEnum.APP_TASK_CREATE:
        check = await checkTaskCount(user.id, quest.countPerUser);
        break;
      case ServiceActionNameEnum.APP_TASK_DONE:
        if (quest.daily) {
          check = await checkDailyAnyTaskDone(user.id);
          break;
        }
        check = await checkTaskDoneCount(user.id, quest.countPerUser);
        break;
      case ServiceActionNameEnum.LINK_VIEW:
        check = true;
        break;
      case ServiceActionNameEnum.TELEGRAM_SUBSCRIBE:
        check = await checkTgSubscribe(user.tgId, quest.link as string);
        break;
      case ServiceActionNameEnum.TELEGRAM_BOOST:
        check = await checkTgBoost(user.tgId, quest.link as string);
        break;
      case ServiceActionNameEnum.TELEGRAM_PLAY:
        check = true;
        break;
      case ServiceActionNameEnum.X_SUBSCRIBE:
        check = true;
        break;
      default:
        return {
          success: false,
          message: t('notAvailable'),
        }
    }

    check && await earnOnQuest(quest, user);

    return { 
      success: check,
      message: check ? t('completed') : t('failed'),
    };
  } catch (error) {
    console.log('Check Error:', error);
    return { 
      success: false, 
      message: t('tryAgain'),
    };
  }
}

export async function earnOnQuest(quest: Quest, user: User) {
  const { updatedUser } = await createQuestEarningWithBalanceUpdate(
    { userId: user.id, questId: quest.id, profit: quest.price },
    user.balance + quest.price,
  )
  await setSession(updatedUser); // TODO!?: tx?
}

export async function checkQuestDone(quest: Quest, user: User) {
  const [lastDoneDate, doneCountToday] = await Promise.all([
    fetchLastDateUserDoneQuest(user.id, quest.id),
    fetchQuestDoneCountTodayByUserAndQuestId(user.id, quest.id)
  ]);
  const check = quest.daily ? doneCountToday >= quest.countPerUser && checkDailyDone(lastDoneDate) : !!lastDoneDate;
 
  return check;
}

export async function checkDailyAnyTaskDone(userId: number) {
  const taskEarning = await fetchTaskEarningLastDoneByUserId(userId);
  const check = checkDailyDone(taskEarning?.createdAt);
  return check;
}

export async function checkInvitedCount(userId: number, countNeed: number) {
  const count = await fetchUserReferralsCount(userId);
  const check = count >= countNeed;
  
  return check;
}

export async function checkTaskCount(userId: number, countNeed: number) {
  const count = await fetchTaskCountByUserId(userId);
  const check = count >= countNeed;
  
  return check;
}

export async function checkTaskDoneCount(userId: number, countNeed: number) {
  const count = await fetchTaskEarningDoneCountByUserId(userId);
  const check = count >= countNeed;
  
  return check;
}

export async function checkQuestDoneCount(userId: number, countNeed: number) {
  const count = await fetchQuestDoneCountByUserId(userId);
  const check = count >= countNeed;
  
  return check;
}