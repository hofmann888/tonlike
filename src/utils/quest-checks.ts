'use server'

import { getAuthUser, getSession } from "@/app/auth/session";
import { fetchLastDateUserDoneQuest, fetchQuestById, createQuestEarning, updateUserWithSession, fetchLastTaskEarningByUserId, fetchUserReferralsCount } from "@/db/query";
import { Quest, User } from '@/lib/definitions';
// import { redirect } from 'next/navigation';
// import { revalidatePath } from 'next/cache'; 

import { checkDailyDone } from "./helpers";

// TODO: refactor on class oop

const questMap = { // TODO!: don't bind ID!! local and prod db will be different 
  checkIn: 1,
  taskDone: 3,
  inviteFriend: 6, 
}

export async function checkQuest(questId: number) {
  console.log('checkQuest');

  try {
    const [user, quest, dailyDone] = await Promise.all([
      getAuthUser(false), 
      fetchQuestById(questId), 
      checkDailyQuestDone(questId),
    ]);
  
    if (quest.daily && dailyDone) {
      throw new Error('Quest already done today.');
    }
    
    let check = false;
  
    switch (questId) {
      case questMap.checkIn:
        check = true;
        break;
      case questMap.taskDone:
        check = await checkDailyAnyTaskDone(user.id);
        break;
      case questMap.inviteFriend:
        check = await checkFriendsInvited(user.id, quest.countPerUser);
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



export async function checkDailyQuestDone(questId: number) { // TODO?: userId
  console.log('checkDailyQuestDone');
  const user: User = await getAuthUser(false);

  const lastDoneDate = await fetchLastDateUserDoneQuest(user.id, questId); // TODO?: fetchLatQuestEarning?s

  return checkDailyDone(lastDoneDate);
}

export async function checkDailyAnyTaskDone(userId: number) {
  console.log('checkDailyAnyTaskDone');
  const taskEarning = await fetchLastTaskEarningByUserId(userId);

  return checkDailyDone(taskEarning.createdAt);
}

export async function checkFriendsInvited(userId: number, countNeed: number) {
  const count = await fetchUserReferralsCount(userId);
  
  return count >= countNeed;
}