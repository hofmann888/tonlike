// import { users, services, actions, serviceActions } from './seed-data';
import { TaskStatusEnum } from "@/lib/definitions";
import { seed } from "drizzle-seed";
import { sql } from 'drizzle-orm';
import { db } from "../db";
import * as seedData from "./seed-data";
import * as schema from "../schema";

async function main() {
  await clearData();

  await seedUsers();
  await seedServices();
  await seedActions();
  await seedServiceActions();
  await seedQuests();
  await seedTasksWithRelations();
}

async function clearData() {
  console.log('clearData');
  await db.delete(schema.blackList);
  await db.delete(schema.reports);
  await db.delete(schema.questEarnings);
  await db.delete(schema.taskEarnings);
  await db.delete(schema.quests);
  await db.delete(schema.tasks);
  await db.delete(schema.serviceActions);
  await db.delete(schema.actions);
  await db.delete(schema.services);
  await db.delete(schema.users);
}

async function seedUsers() {
  console.log('seedUsers');
  await db.execute(sql`alter sequence users_id_seq restart with 1`);
  await db.insert(schema.users).values(seedData.users);
}

async function seedServices() {
  console.log('seedServices');
  await db.execute(sql`alter sequence services_id_seq restart with 1`);
  await db.insert(schema.services).values(seedData.services);
}

async function seedActions() {
  console.log('seedActions');
  await db.execute(sql`alter sequence actions_id_seq restart with 1`);
  await db.insert(schema.actions).values(seedData.actions);
}

async function seedServiceActions() {
  console.log('seedServiceActions');
  await db.execute(sql`alter sequence service_actions_id_seq restart with 1`);
  await db.insert(schema.serviceActions).values(seedData.serviceActions);
}

async function seedQuests() {
  console.log('seedQuests');
  await db.execute(sql`alter sequence quests_id_seq restart with 1`);
  await db.insert(schema.quests).values(seedData.quests);
}

async function seedTasksWithRelations() {
  console.log('seeedTasksWithRelations');
  await seed(db, { 
    tasks: schema.tasks,
    taskEarnings: schema.taskEarnings,
    blackList: schema.blackList
    // reports: schema.reports,
  }).refine((f) => ({
    tasks: {
      count: 30,
      columns: {
          userId: f.int({ minValue: 1, maxValue: 3 }),
          serviceActionId: f.int({ minValue: 1, maxValue: 29 }),
          // serviceId: f.int({ minValue: 1, maxValue: 8 }),
          // actionId: f.int({ minValue: 1, maxValue: 7 }),
          price: f.int({ minValue: 1, maxValue: 10 }),
          count: f.int({ minValue: 100, maxValue: 1000 }),
          done: f.int({ minValue: 0, maxValue: 99 }),
          status: f.weightedRandom([
            { weight: 0.8, value: f.default({ defaultValue: TaskStatusEnum.ACTIVE }) },
            { weight: 0.2, value: f.default({ defaultValue: TaskStatusEnum.PAUSED }) }
          ])  
      },
      with: {
        taskEarnings: 1,
        // reports: [
        //   { weight: 0.9, count: 1 },
        //   { weight: 0.1, count: 10 },
        // ]
      }
    },
    taskEarnings: {
      columns: {
        userId: f.int({ minValue: 1, maxValue: 3 }),
        profit: f.int({ minValue: 0, maxValue: 10 }),
        // status: f.weightedRandom([
        //   { weight: 0.8, value: f.default({ defaultValue: TaskEarningStatusEnum.DONE }) },
        //   { weight: 0.2, value: f.default({ defaultValue: TaskEarningStatusEnum.HIDDEN }) }
        // ]) 
      }
    },
    // reports: {
    //   columns: {
    //     userId: f.int({ minValue: 1, maxValue: 3 }),
    //   }
    // },
    blackList: {
      count: 1,
      columns: {
        userId: f.default({ defaultValue: 1 }),
        blockedUserId: f.int({ minValue: 2, maxValue: 3 }),
      }
    }
  }));

  await db.execute(sql`alter sequence tasks_id_seq restart with 31`);
  await db.execute(sql`alter sequence task_earnings_id_seq restart with 31`);
  await db.execute(sql`alter sequence black_list_id_seq restart with 2`);
}


main();
