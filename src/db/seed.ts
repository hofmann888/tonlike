import { TaskEarningStatusEnum, TaskStatusEnum } from "@/lib/definitions";
import { seed } from "drizzle-seed";
import { sql } from 'drizzle-orm'
import { db } from "./db";
import { users, services, actions, serviceActions } from './seed-data';
import * as schema from "./schema";

async function main() {
  await clearData();

  await seedUsers();
  await seedServices();
  await seedActions();
  await seedServiceActions();

  await seed(db, { 
    tasks: schema.tasksTable, 
    taskEarnings: schema.taskEarningsTable,
    reports: schema.reportsTable,
    blackList: schema.blackListTable
  }).refine((f) => ({
    tasks: {
      count: 30,
      columns: {
          userId: f.int({ minValue: 1, maxValue: 3 }),
          serviceActionId: f.int({ minValue: 1, maxValue: 28 }),
          price: f.int({ minValue: 1, maxValue: 10 }),
          count: f.int({ minValue: 100, maxValue: 1000 }),
          done: f.int({ minValue: 0, maxValue: 99 }),
          status: f.weightedRandom([
            { weight: 0.8, value: f.default({ defaultValue: TaskStatusEnum.ACTIVE }) },
            { weight: 0.2, value: f.default({ defaultValue: TaskStatusEnum.PAUSED }) }
          ])  
      },
      with: {
        taskEarnings: 5,
        reports: [
          { weight: 0.9, count: 1 },
          { weight: 0.1, count: 10 },
        ]
      }
    },
    taskEarnings: {
      columns: {
        userId: f.int({ minValue: 1, maxValue: 3 }),
        profit: f.int({ minValue: 1, maxValue: 10 }),
        status: f.weightedRandom([
          { weight: 0.8, value: f.default({ defaultValue: TaskEarningStatusEnum.DONE }) },
          { weight: 0.2, value: f.default({ defaultValue: TaskEarningStatusEnum.HIDDEN }) }
        ]) 
      }
    },
    reports: {
      columns: {
        userId: f.int({ minValue: 1, maxValue: 3 }),
      }
    },
    blackList: {
      count: 1,
      columns: {
        userId: f.default({ defaultValue: 1 }),
        blockedUserId: f.int({ minValue: 2, maxValue: 3 }),
      }
    }
  }));
}

async function seedUsers() {
  console.log('seedUsers');
  await db.execute(sql`alter sequence users_id_seq restart with 1`);
  await db.insert(schema.usersTable).values(users);
}

async function seedServices() {
  console.log('seedServices');
  await db.execute(sql`alter sequence services_id_seq restart with 1`);
  await db.insert(schema.servicesTable).values(services);
}

async function seedActions() {
  console.log('seedActions');
  await db.execute(sql`alter sequence actions_id_seq restart with 1`);
  await db.insert(schema.actionsTable).values(actions);
}

async function seedServiceActions() {
  console.log('seedServiceActions');
  await db.execute(sql`alter sequence service_actions_id_seq restart with 1`);
  await db.insert(schema.serviceActionsTable).values(serviceActions);
}

async function clearData() {
  await db.delete(schema.blackListTable);
  await db.delete(schema.reportsTable);
  await db.delete(schema.questEarningsTable);
  await db.delete(schema.taskEarningsTable);
  await db.delete(schema.questsTable);
  await db.delete(schema.tasksTable);
  await db.delete(schema.serviceActionsTable);
  await db.delete(schema.actionsTable);
  await db.delete(schema.servicesTable);
  await db.delete(schema.usersTable);
}

main();
