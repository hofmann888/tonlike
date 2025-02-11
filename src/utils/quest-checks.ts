'use server'

import { getAuthUser, setSession } from "@/app/auth/session";
import { 
  fetchLastDateUserDoneQuest, 
  fetchQuestById, 
  fetchLastDoneTaskEarningByUserId, 
  fetchUserReferralsCount, 
  fetchDoneTaskEarningCountByUserId, 
  fetchDoneQuestEarningCountByUserId,
  fetchTaskCountByUserId,
  createQuestEarningWithBalanceUpdate,
} from "@/db/query";
import { Quest, User, ServiceActionName } from '@/lib/definitions';
import { checkDailyDone } from "./helpers";
import { QuestRelationEnum } from "@/db/schema";
import { checkTgSubscribe, checkTgBoost } from "./task-checks";
// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache'; 


// TODO: refactor on class oop
// TODO: try catch exceptions

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
      case ServiceActionName.TELEGRAM_SUBSCRIBE:
        check = await checkTgSubscribe(user.tgId, quest.link as string);
        break;
      case ServiceActionName.TELEGRAM_BOOST:
        check = await checkTgBoost(user.tgId, quest.link as string);
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

export async function earnOnQuest(quest: Quest, user: User) {
  console.log('earnOnQuest');
  const { updatedUser } = await createQuestEarningWithBalanceUpdate(
    { userId: user.id, questId: quest.id, profit: quest.price },
    user.balance + quest.price,
  )

  await setSession(updatedUser); // TODO: what if error? mb use transaction and make rollback on this too?
}


export async function checkDailyQuestDone(questId: number, userId: number) { // TODO?: userId
  console.log('checkDailyQuestDone');
  let check = false;
  try {
    const lastDoneDate = await fetchLastDateUserDoneQuest(userId, questId); // TODO?: fetchLatQuestEarning?s
    check = checkDailyDone(lastDoneDate);
  } catch (error) {
    console.log(error);
  }
  return check;
}


export async function checkDailyAnyTaskDone(userId: number) {
  console.log('checkDailyAnyTaskDone');
  let check = false;
  try {
    const taskEarning = await fetchLastDoneTaskEarningByUserId(userId);
    check = checkDailyDone(taskEarning.createdAt);
  } catch (error) {
    console.log(error);
  }
  return check;
  
}

export async function checkInvitedCount(userId: number, countNeed: number) {
  console.log('checkInvitedCount');
  let check = false;
  try {
    const count = await fetchUserReferralsCount(userId);
    check = count >= countNeed;
  } catch (error) {
    console.log(error);
  }
  return check;
}

export async function checkTaskCount(userId: number, countNeed: number) {
  console.log('checkTaskCount');
  let check = false;
  try {
    const count = await fetchTaskCountByUserId(userId);
    check = count >= countNeed;
  } catch (error) {
    console.log(error);
  }
  return check;
  
}

export async function checkTaskDoneCount(userId: number, countNeed: number) {
  console.log('checkTaskDoneCount');
  let check = false;
  try {
    const count = await fetchDoneTaskEarningCountByUserId(userId);
    check = count >= countNeed;
  } catch (error) {
    console.log(error);
  }
  return check;
}

export async function checkQuestDoneCount(userId: number, countNeed: number) {
  console.log('checkQuestDoneCount');
  let check = false;
  try {
    const count = await fetchDoneQuestEarningCountByUserId(userId);
    check = count >= countNeed;
  } catch (error) {
    console.log(error);
  }
  return check;
}