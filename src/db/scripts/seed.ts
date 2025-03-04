import { Task, TaskStatusEnum } from "@/lib/definitions";
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
  await seedTasks();
  await seedTaskEarnings();
  await seedBlackList();
  // await seedTasksWithRelations();
}

async function clearData() {
  console.log('clearing data...');
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
  // TODO?:
  // const db = drizzle(process.env.DATABASE_URL!);
  // await reset(db, schema);
}

async function seedUsers() {
  console.log('seeding users...');
  await db.execute(sql`alter sequence users_id_seq restart with 1`);
  await db.insert(schema.users).values(seedData.users);
}

async function seedServices() {
  console.log('seeding services...');
  await db.execute(sql`alter sequence services_id_seq restart with 1`);
  await db.insert(schema.services).values(seedData.services);
}

async function seedActions() {
  console.log('seeding actions...');
  await db.execute(sql`alter sequence actions_id_seq restart with 1`);
  await db.insert(schema.actions).values(seedData.actions);
}

async function seedServiceActions() {
  console.log('seeding service_actions...');
  await db.execute(sql`alter sequence service_actions_id_seq restart with 1`);
  await db.insert(schema.serviceActions).values(seedData.serviceActions);
}

async function seedQuests() {
  console.log('seeding quests...');
  await db.execute(sql`alter sequence quests_id_seq restart with 1`);
  await db.insert(schema.quests).values(seedData.quests);
}

async function seedTasks() {
  console.log('seeding tasks...');
  await db.execute(sql`alter sequence tasks_id_seq restart with 1`);
  await db.insert(schema.tasks).values(seedData.tasks);
}

async function seedTaskEarnings() {
  console.log('seeding tasks_earnings...');
  await db.execute(sql`alter sequence task_earnings_id_seq restart with 1`);
  await db.insert(schema.taskEarnings).values(seedData.taskEarnings);
}

async function seedBlackList() {
  console.log('seeding black_list...');
  await db.execute(sql`alter sequence black_list_id_seq restart with 1`);
  await db.insert(schema.blackList).values(seedData.blackList);
}

async function seedTasksWithRelations() {
  console.log('seeeding tasks with relations...');
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
          price: f.int({ minValue: 1, maxValue: 10 }),
          count: f.int({ minValue: 100, maxValue: 1000 }),
          link: f.valuesFromArray({ values: [
            'https://t.me/test/',
            'https://x.com/test/',
            'https://twitter.com/test/',
            'https://instagram.com/test/',
            'https://tiktok.com/@test/',
            'https://youtube.com/@test/',
            'https://vk.com/test/',
            'https://warpcast.com/test/',
          ]}),
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
      }
    },
    blackList: {
      count: 1,
      columns: {
        userId: f.default({ defaultValue: 1 }),
        blockedUserId: f.int({ minValue: 2, maxValue: 3 }),
      }
    }
    // reports: {
    //   columns: {
    //     userId: f.int({ minValue: 1, maxValue: 3 }),
    //   }
    // },
  }));

  await db.execute(sql`alter sequence tasks_id_seq restart with 31`);
  await db.execute(sql`alter sequence task_earnings_id_seq restart with 31`);
  await db.execute(sql`alter sequence black_list_id_seq restart with 2`);
}

async function addTasks() {
  console.log('adding tasks...');
  const task = {
    userId: 1,
    serviceActionId: 1,
    link: 'link1',
    price: 1,
    count: 111,
    status: 'active',
  }

  let tasks = [];

  for (let index = 0; index < 4000; index++) { // max - ~4600
    tasks.push(task as Task);
  }

  await db.insert(schema.tasks).values(tasks);
}

main();