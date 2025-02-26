// import { getAuthUser } from "@/app/auth/session";
// import { createQuestEarning, fetchLastDateUserDoneQuest, fetchLastTaskEarningByUserId, fetchQuestById, fetchUserReferralsCount, updateUserWithSession } from "@/db/query";
// import { Quest, User } from "@/lib/definitions";
// import { checkDailyQuestDone } from "./quest-checks";
// import { checkDailyDone } from "./helpers";

// // TODO?: nuzhno?
// export default class QuestCheker {
//   protected quest: Quest = {} as Quest;
//   protected user: User = {} as User;
//   protected dailyDone: boolean = false;
//   protected inited: boolean = false;
//   // protected check: boolean = false;

//   private questMap = {
//     checkIn: 1,
//     taskDone: 3,
//     inviteFriend: 6, 
//   }

//   constructor(public questId: number) {}

//   protected async init() {
//     if (!this.inited) {
//       const [user, quest, dailyDone] = await Promise.all([
//         getAuthUser(false, true), 
//         fetchQuestById(this.questId), 
//         checkDailyQuestDone(this.questId),
//       ]);
  
//       this.quest = quest;
//       this.user = user;
//       this.dailyDone = dailyDone;
//       this.inited = true;
//     }
//   }

//   public async check() {
//     let check = false;

//     try {
//       this.init();
    
//       if (this.quest.daily && this.dailyDone) {
//         throw new Error('Quest already done today.');
//       }
      
//       switch (this.questId) {
//         case this.questMap.checkIn:
//           check = true;
//           break;
//         case this.questMap.taskDone:
//           check = await this.checkDailyAnyTaskDone();
//           break;
//         case this.questMap.inviteFriend:
//           check = await this.checkFriendsInvited();
//           break;
//         default:
//           console.log(`Couldn't find checker for quest.`);
//       }
//       console.log('checkQuest check:', check);
  
//       if (check) { 
//         await this.earnOnQuest();
//       }
  
//       return check;
//     } catch (error) {
//       console.log('Check failed! Error:', error);
//       return false;
//     }
//   }

//   protected async earnOnQuest() {
//     console.log('earnOnQuest');
//     const questEarningId = await createQuestEarning({ 
//       userId: this.user.id, 
//       questId: this.quest.id, 
//       profit: this.quest.price 
//     });
  
//     if (questEarningId) {
//       const balance = this.user.balance + this.quest.price;
//       await updateUserWithSession(this.user.id, { balance });
//     }
//   }


//   //================ Checks

//   protected async checkDailyQuestDone() {
//     console.log('checkDailyQuestDone');
//     const lastDoneDate = await fetchLastDateUserDoneQuest(this.user.id, this.questId); // TODO?: fetchLatQuestEarning?s
  
//     return checkDailyDone(lastDoneDate);
//   }
  
//   protected async checkDailyAnyTaskDone() {
//     console.log('checkDailyAnyTaskDone');
//     const taskEarning = await fetchLastTaskEarningByUserId(this.user.id);
  
//     return checkDailyDone(taskEarning.createdAt);
//   }
  
//   protected async  checkFriendsInvited() {
//     console.log('checkFriendsInvited');
//     const count = await fetchUserReferralsCount(this.user.id);
    
//     return count >= this.quest.countPerUser;
//   }
// }