'use server'

import { getAuthUser } from "@/app/auth/session";
import { 
  fetchLastDateUserDoneQuest, 
  fetchQuestById, 
  createQuestEarning, 
  updateUserWithSession, 
  fetchLastDoneTaskEarningByUserId, 
  fetchUserReferralsCount, 
  fetchDoneTaskEarningCountByUserId, 
  fetchDoneQuestEarningCountByUserId,
  fetchTaskCountByUserId,
} from "@/db/query";
import { Quest, User, ServiceActionName } from '@/lib/definitions';
// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache'; 

import { checkDailyDone } from "./helpers";
import { QuestRelationEnum } from "@/db/schema";

// TODO: refactor on class oop

export async function checkQuest(questId: number) {
  console.log('checkQuest');

  try {
    const [user, quest] = await Promise.all([
      getAuthUser(false), 
      fetchQuestById(questId, [QuestRelationEnum.SERVICE_ACTION]), 
    ]);

    const dailyDone = await checkDailyQuestDone(quest.id, user.id);
  
    if (quest.daily && dailyDone) {
      throw new Error('Quest already done today.');
    }
    
    let check = false;
  
    switch (quest.serviceAction.name) {
      case ServiceActionName.APP_CHECK_IN:
        check = true;
        break;
      case ServiceActionName.APP_INVITE:
        check = await checkInvitedCount(user.id, quest.countPerUser);
        break;
      case ServiceActionName.APP_QUEST_DONE:
        check = await checkQuestDoneCount(user.id, quest.countPerUser);
        break;
      case ServiceActionName.APP_TASK_CREATE:
        check = await checkTaskCount(user.id, quest.countPerUser);
        break;
      case ServiceActionName.APP_TASK_DONE:
        if (quest.daily) {
          check = await checkDailyAnyTaskDone(user.id);
          break;
        }
        check = await checkTaskDoneCount(user.id, quest.countPerUser);
        break;
      default:
        console.log(`Couldn't find checker for quest.`);
    }
    console.log('checkQuest check:', check);

    if (check) { 
      await earnOnQuest(quest, user);
    }

    return check;
  } catch (error) {
    console.log('Check failed! Error:', error);
    return false;
  }
  // revalidatePath('/earn?tab=quests');
  // redirect('/earn?tab=quests');
}

export async function earnOnQuest(quest: Quest, user: User) { // TODO!!: db transaction
  console.log('earnOnQuest');
  const questEarningId = await createQuestEarning({ userId: user.id, questId: quest.id, profit: quest.price });

  if (questEarningId) {
    const balance = user.balance + quest.price;
    await updateUserWithSession(user.id, { balance });
  }
}


export async function checkDailyQuestDone(questId: number, userId: number) { // TODO?: userId
  console.log('checkDailyQuestDone');
  const lastDoneDate = await fetchLastDateUserDoneQuest(userId, questId); // TODO?: fetchLatQuestEarning?s

  return checkDailyDone(lastDoneDate);
}


export async function checkDailyAnyTaskDone(userId: number) {
  console.log('checkDailyAnyTaskDone');
  const taskEarning = await fetchLastDoneTaskEarningByUserId(userId);

  return checkDailyDone(taskEarning.createdAt);
}

export async function checkInvitedCount(userId: number, countNeed: number) {
  console.log('checkInvitedCount');
  const count = await fetchUserReferralsCount(userId);
  
  return count >= countNeed;
}

export async function checkTaskCount(userId: number, countNeed: number) {
  console.log('checkTaskCount');
  const count = await fetchTaskCountByUserId(userId);
  
  return count >= countNeed;
}

export async function checkTaskDoneCount(userId: number, countNeed: number) {
  console.log('checkTaskDoneCount');
  const count = await fetchDoneTaskEarningCountByUserId(userId);
  
  return count >= countNeed;
}

export async function checkQuestDoneCount(userId: number, countNeed: number) {
  console.log('checkQuestDoneCount');
  const count = await fetchDoneQuestEarningCountByUserId(userId);
  
  return count >= countNeed;
}