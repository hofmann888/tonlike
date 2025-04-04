'use server'

import 'server-only';

import { Action, BlackListItem, LeaderboardItem, Performer, Product, Quest, Referral, Service, ServiceAction, Task, TaskEarning, TaskStatusEnum, User } from '@/lib/definitions';
import { sql, and, eq, ne, gt, isNull, asc, desc, getTableColumns, inArray, sum, count, max } from 'drizzle-orm';
import { setSession } from '@/core/session';
import { db } from './db';
import * as schema from './schema';
import * as dto from './dto';

// TODO: errors
// TODO?: Failed to (fetch|update|insert|delete data) | (execute query)
// TODO?: dto -> ...Data

// ------------ USERS ------------
export async function createUser(dto: dto.UserInsertDTO) {
  try {
    const data = await db
      .insert(schema.users)
      .values(dto)
      .returning()
    ;

    return data[0] as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create user.');
  }
}

function updateUserQuery(id: number, dto: dto.UserUpdateDto) {
  return db
    .update(schema.users)
    .set({ ...dto, updatedAt: sql`NOW()` })
    .where(eq(schema.users.id, id))
    .returning()
  ;
}

export async function updateUser(id: number, dto: dto.UserUpdateDto) {
  try {
    const [data] = await updateUserQuery(id, dto);

    if (!data) {
      throw new Error('Wrong user ID.');
    }

    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update user data.');
  }
}

export async function updateUserWithSession(id: number, dto: dto.UserUpdateDto) { // TODO?: move to session? or just update user with param?
  try {
    // TODO?: tx?
    const user = await updateUser(id, dto);
    await setSession(user);
    
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to update user data.');
  }
}

export async function fetchUserById(id: number) {
  try {
    const data = await db.query.users.findFirst({ where: eq(schema.users.id, id) });

    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchUserByTgId(tgId: number) {
  try {
    const data = await db.query.users.findFirst({ where: eq(schema.users.tgId, tgId) });

    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchUserReferrals(userId: number) {
  try {
    const data = await db
      .select({
        id: schema.users.id,
        tgId: schema.users.tgId,
        tgUsername: schema.users.tgUsername,
        tgPhotoUrl: schema.users.tgPhotoUrl,
        createdAt: schema.users.createdAt,
        profit: sum(schema.taskEarnings.profit).mapWith(Number),
      })
      .from(schema.users)
      .leftJoin(schema.taskEarnings,
        and(
          eq(schema.taskEarnings.userId, schema.users.id),
          gt(schema.taskEarnings.profit, 0),
        )
      )
      .where(eq(schema.users.referrerId, userId))
      .groupBy(schema.users.id, schema.users.tgUsername, schema.users.tgPhotoUrl, schema.users.createdAt)
      .orderBy(desc(schema.users.createdAt))
    ;

    return data as Referral[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch referrals data.');
  }
}

export async function fetchUserReferralsCount(userId: number) {
  try {
    const data = await db.$count(schema.users, eq(schema.users.referrerId, userId));

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchUserReferralsTaskEarningsSum(userId: number, today: boolean = false) {
  try {
    const [data] = await db.select({
      sum: sum(schema.taskEarnings.profit).mapWith(Number)
    })
    .from(schema.users)
    .leftJoin(schema.taskEarnings, 
      and(
        eq(schema.taskEarnings.userId, schema.users.id),
        gt(schema.taskEarnings.profit, 0),
      )
    )
    .where(
      and(
        eq(schema.users.referrerId, userId),
        today ? sql`date(${schema.taskEarnings.createdAt}) = current_date` : undefined,
      )
    );

    return data.sum;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchLeaderboard(limit: number) {
  try {
    const data = await db.select({ 
      position: sql<number>`row_number() over(order by balance desc)`.mapWith(Number),
      balance: schema.users.balance,
      tgId: schema.users.tgId,
      tgUsername: schema.users.tgUsername,
      tgPhotoUrl: schema.users.tgPhotoUrl,
    })
    .from(schema.users)
    .limit(limit);

    return data as LeaderboardItem[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

export async function fetchLeaderboardPositionByUserId(userId: number) {
  try {
    const sq = db.select({ 
      id: schema.users.id,
      rn: sql<number>`row_number() over(order by balance desc)`.mapWith(Number).as('rn') 
    }).from(schema.users).as('sq');

    const [data] = await db.select({ rn: sq.rn }).from(sq).where(eq(sq.id, userId));

    return data?.rn;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data.');
  }
}

// ------------ ACTIONS ------------ 
export async function fetchActions(active?: boolean) {
  try {
    const data = await db.query.actions.findMany({ 
      orderBy: [asc(schema.actions.id)],
      ...(active !== undefined && { where: eq(schema.actions.active, active) })
    });

    return data as Action[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch actions data.');
  }
}

export async function fetchActionById(id: number) {
  try {
    const data = await db.query.actions.findFirst({ where: eq(schema.actions.id, id) });

    return data as Action;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch action data.');
  }
}

// ------------ SERVICES ------------ 
export async function fetchServices(active?: boolean) {
  try {
    const data = await db.query.services.findMany({ 
      orderBy: [asc(schema.services.id)],
      ...(active !== undefined && { where: eq(schema.actions.active, active) })
    });

    return data as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services data.');
  }
}

export async function fetchServiceById(id: number) {
  try {
    const data = await db.query.actions.findFirst({ where: eq(schema.services.id, id) });

    return data as Service;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service data.');
  }
}

export async function fetchServicesWithActions(active?: boolean) {
  try {
    const data = await db.query.services.findMany({ // TODO: check if service.name !== app
      with: { 
        serviceActions: { 
          ...(active && { where: eq(schema.serviceActions.active, active) }),
          with: { 
            action: true, // TODO: refactor for check 'active' in query
          } 
        } 
      },
      orderBy: [asc(schema.services.id)],
      ...(active !== undefined && { where: eq(schema.services.active, active) })
    });

    if (active !== undefined) { // TODO: refactor - move to query
      data.map((service) => {
        if (!!service.serviceActions.length) {
          service.serviceActions = service.serviceActions.filter((serviceAction) => serviceAction.action.active === active);
        }
      })
    }

    return data as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services data.');
  }
}

// ------------ SERVICE ACTIONS ------------ 
export async function fetchServiceActionById(id: number, relations: schema.ServiceActionsRelation[]) {
  try {
    let withObject: any;
    if (relations && relations.length) {
      withObject = {};
      relations.map((relation) => {
        withObject[relation] = true;
      })
    }

    const data = await db.query.serviceActions.findFirst({ 
      where: eq(schema.services.id, id),
      ...(withObject && { with: withObject })
    });

    return data as ServiceAction;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service data.');
  }
}

// ------------ TASKS ------------
// TODO: check services and actions `active` field on fetch 
// TODO?: check deleted_at? (remove status 'deleted'?)

export async function createTask(dto: dto.TaskInsertDTO, tx?: any) {
  try {
    const con = tx ?? db;
    const data = await con.insert(schema.tasks).values(dto).returning({ id: schema.tasks.id });

    return data[0].id;
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create task.');
  }
}

// TODO?: refactor tx?
export async function createTaskWithBalanceUpdate(dto: dto.TaskInsertDTO, balance: number) {
  try {
    const batch = await db.batch([
      db.insert(schema.tasks).values(dto).returning({ id: schema.tasks.id }),
      updateUserQuery(dto.userId, { balance: balance }),
    ]);

    return { 
      taskId: batch[0][0].id, 
      updatedUser: batch[1][0] as User 
    };
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create task.');
  }
}

function updateTaskQuery(id: number, dto: dto.TaskUpdateDTO) {
  return db
    .update(schema.tasks)
    .set({ ...dto, updatedAt: sql`NOW()` }) // TODO?: check if dto is empty
    .where(eq(schema.tasks.id, id))
    .returning({ id: schema.tasks.id }) // TODO?: return Task?
  ;
}

export async function updateTask(id: number, dto: dto.TaskUpdateDTO) {
  try {
    const [data] = await updateTaskQuery(id, dto);

    return data?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update task data.');
  }
}

// TODO!: refactor!
export async function updateTaskWithBalance(id: number, dto: dto.TaskUpdateDTO, userId: number, balance: number) {
  try {
    const batch = await db.batch([
      db.update(schema.tasks)
        .set({ ...dto, updatedAt: sql`NOW()` })
        .where(eq(schema.tasks.id, id))
        .returning({ id: schema.tasks.id }),
      updateUserQuery(userId, { balance: balance }),
    ]);

    return { 
      taskId: batch[0][0].id, 
      updatedUser: batch[1][0] as User 
    };
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create task.');
  }
}

export async function fetchTaskById(id: number, relations?: schema.TaskRelation[]) {
  try {
    let withObject: any;
    if (relations && relations.length) {
      withObject = {};
      relations.map((relation) => {
        withObject[relation] = true;
      })
    }

    const data = await db.query.tasks.findFirst({ 
      where: eq(schema.tasks.id, id),
      ...(withObject && { with: withObject })
    });
    
    return data as Task;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch task data.');
  }
}

export async function fetchTasksByUserId(userId: number) {
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.tasks), 
        doneCount: count(schema.taskEarnings.id),
        doneSum: sum(schema.taskEarnings.profit).mapWith(Number),
        service: getTableColumns(schema.services),
        action: getTableColumns(schema.actions),
        serviceAction: getTableColumns(schema.serviceActions),
      })
      .from(schema.tasks)
      .leftJoin(schema.serviceActions, eq(schema.serviceActions.id, schema.tasks.serviceActionId))
      .leftJoin(schema.services, eq(schema.services.id, schema.serviceActions.serviceId))
      .leftJoin(schema.actions, eq(schema.actions.id, schema.serviceActions.actionId))
      .leftJoin(schema.taskEarnings, 
        and(
          eq(schema.taskEarnings.taskId, schema.tasks.id),
          gt(schema.taskEarnings.profit, 0),
        )
      )
      .where(eq(schema.tasks.userId, userId))
      .groupBy(schema.tasks.id, schema.services.id, schema.actions.id, schema.serviceActions.id)
      .orderBy(desc(schema.tasks.createdAt))
    ;

    return data as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks data.');
  }
}

export async function fetchTaskCountByUserId(userId: number) {
  try {
    const data = await db.$count(schema.tasks, 
      and(
        eq(schema.tasks.userId, userId),
      )
    );

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchEarnTasksByUserId(userId: number) {
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.tasks), 
        service: getTableColumns(schema.services),
        action: getTableColumns(schema.actions),
        serviceAction: getTableColumns(schema.serviceActions),
      })
      .from(schema.tasks)
      .leftJoin(schema.serviceActions, eq(schema.serviceActions.id, schema.tasks.serviceActionId))
      .leftJoin(schema.services, eq(schema.services.id, schema.serviceActions.serviceId))
      .leftJoin(schema.actions, eq(schema.actions.id, schema.serviceActions.actionId))
      .leftJoin(schema.taskEarnings, 
        and(
          eq(schema.taskEarnings.taskId, schema.tasks.id), 
          eq(schema.taskEarnings.userId, userId)
        )
      )
      .leftJoin(schema.reports, 
        and(
          eq(schema.reports.taskId, schema.tasks.id), 
          eq(schema.reports.userId, userId)
        )
      )
      .leftJoin(schema.blackList, 
        and(
          eq(schema.blackList.userId, schema.tasks.userId), 
          eq(schema.blackList.blockedUserId, userId)
        )
      )
      .where(
        and(
          ne(schema.tasks.userId, userId),
          eq(schema.tasks.status, TaskStatusEnum.ACTIVE),
          eq(schema.serviceActions.active, true),
          eq(schema.services.active, true),
          eq(schema.actions.active, true),
          isNull(schema.taskEarnings.id),
          isNull(schema.reports.id),
          isNull(schema.blackList.id),
        )
      )
      .orderBy(desc(schema.tasks.price))
    ;

    return data as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch earn tasks data.');
  }
}

export async function fetchTaskPerformers(taskId: number) {
  try {
    const data = await db
      .select({
        id: schema.users.id,
        tgId: schema.users.tgId,
        tgUsername: schema.users.tgUsername,
        tgPhotoUrl: schema.users.tgPhotoUrl,
        profit: schema.taskEarnings.profit,
        doneAt: schema.taskEarnings.createdAt,
        isBlocked: sql`CASE WHEN black_list.id IS NOT NULL THEN TRUE ELSE FALSE END`,
      })
      .from(schema.taskEarnings)
      .leftJoin(schema.users, eq(schema.users.id, schema.taskEarnings.userId))
      .leftJoin(schema.tasks, eq(schema.tasks.id, schema.taskEarnings.taskId))
      .leftJoin(schema.blackList, and(
        eq(schema.blackList.userId, schema.tasks.userId),
        eq(schema.blackList.blockedUserId, schema.taskEarnings.userId)
      ))
      .where(
        and(
          eq(schema.taskEarnings.taskId, taskId),
          gt(schema.taskEarnings.profit, 0),
        )
      )
      .orderBy(desc(schema.taskEarnings.createdAt))
    ;

    return data as Performer[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch performers.');
  }
}

export async function userHasTask(taskId: number, userId: number) {
  try {
    const data = await db.query.tasks.findFirst({
      columns: { id: true },
      where: and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId))
    });

    return !!data?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function taskIsAvailableForUser(taskId: number, userId: number) {
  try {
    const data = await db
      .select({
        id: schema.tasks.id,
      })
      .from(schema.tasks)
      .leftJoin(schema.taskEarnings, 
        and(
          eq(schema.taskEarnings.taskId, taskId),
          eq(schema.taskEarnings.userId, userId)
        )
      )
      .leftJoin(schema.reports, 
        and(
          eq(schema.reports.taskId, taskId),
          eq(schema.reports.userId, userId)
        )
      )
      .leftJoin(schema.blackList, 
        and(
          eq(schema.blackList.userId, schema.tasks.userId),
          eq(schema.blackList.blockedUserId, userId),
        )
      )
      .where(
        and(
          eq(schema.tasks.id, taskId),
          eq(schema.tasks.status, TaskStatusEnum.ACTIVE),
          ne(schema.tasks.userId, userId),
          isNull(schema.taskEarnings.id),
          isNull(schema.reports.id),
          isNull(schema.blackList.id),
        )
      )
      .limit(1)
      .orderBy(desc(schema.taskEarnings.createdAt))
    ;

    return !!data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function isTaskExists(userId: number, serviceActionId: number, link: string) {
  try {
    const data = await db.query.tasks.findFirst({ 
      where: and(
        eq(schema.tasks.userId, userId),
        eq(schema.tasks.serviceActionId, serviceActionId),
        eq(schema.tasks.link, link),
        inArray(schema.tasks.status, [TaskStatusEnum.ACTIVE, TaskStatusEnum.PAUSED]) // TODO?: TaskStatusEnum.DONE
      ),
      columns: { id: true }
     });

     return !!data?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

// ------------ TASK EARNINGS ------------
export async function createTaskEarning(dto: dto.TaskEarningInsertDTO) {
  try {
    const data = await db
      .insert(schema.taskEarnings)
      .values(dto)
      .returning({ id: schema.taskEarnings.id })
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data.');
  }
}

export async function createTaskEarningWithBalanceUpdate(dto: dto.TaskEarningInsertDTO, balance: number, done: boolean = false) { // TODO refactor balance recalculate logic
  try {
    const queries: any = [
      db.insert(schema.taskEarnings).values(dto).returning({ id: schema.questEarnings.id }),
      updateUserQuery(dto.userId, { balance: balance }),
    ];

    if (done) {
      queries.push(updateTaskQuery(dto.taskId, { status: TaskStatusEnum.DONE }));
    }

    const batch = await db.batch(queries);

    return { 
      taskEarningId: batch[0][0].id, 
      updatedUser: batch[1][0] as User 
    };
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function hideTaskEarningForUser(taskId: number, userId: number) { // TODO?: isHidden?
  try {
    const data = await db
      .insert(schema.taskEarnings)
      .values({ userId, taskId })
      .returning({ id: schema.taskEarnings.id })
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data.');
  }
}

export async function fetchTaskEarningLastDoneByUserId(userId: number) {
  try {
    const data = await db.query.taskEarnings.findFirst({ 
      where: 
        and(
          eq(schema.taskEarnings.userId, userId),
          ne(schema.taskEarnings.profit, 0)
        ),
      orderBy: desc(schema.taskEarnings.createdAt),
    });
    
    return data as TaskEarning;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch task data.');
  }
}

export async function fetchTaskEarningDoneCountByUserId(userId: number) {
  try {
    const data = await db.$count(schema.taskEarnings, 
      and(
        eq(schema.taskEarnings.userId, userId),
        gt(schema.taskEarnings.profit, 0)
      )
    );

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchTaskDoneCount(taskId: number) {
  try {
    const data = await db.$count(schema.taskEarnings, 
      and(
        eq(schema.taskEarnings.taskId, taskId),
        gt(schema.taskEarnings.profit, 0)
      )
    );

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchTaskDoneSum(taskId: number) {
  try {
    const [data] = await db.select({
      sum: sum(schema.taskEarnings.profit).mapWith(Number)
    })
    .from(schema.taskEarnings)
    .where(
      and(
        eq(schema.taskEarnings.taskId, taskId),
        gt(schema.taskEarnings.profit, 0)
      )
    );

    return data.sum;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

// ------------ REPORTS ------------
export async function createReport(dto: dto.ReportInsertDTO) {
  try {
    const data = await db
      .insert(schema.reports)
      .values(dto)
      .returning({ id: schema.reports.id })
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data.');
  }
}

// ------------ BLACK LIST ------------
export async function fetchBlackListByUserId(userId: number) {
  try {
    const data = await db.query.blackList.findMany({ 
      with: {
        blockedUser: true,
      },
      where: eq(schema.blackList.userId, userId),
      orderBy: desc(schema.blackList.createdAt)
    });

    return data as BlackListItem[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch black list data.');
  }
}

export async function addUserToBlackList(dto: dto.BlackListInsertDTO) { // TODO!?: limit on blocked users  
  try {
    const data = await db
      .insert(schema.blackList)
      .values(dto)
      .returning({ id: schema.blackList.id })
    ;

    return data[0].id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data.');
  }
}

export async function removeUserFromBlackList(userId: number, blockedUserId: number) { // TODO?: deleted_at?
  try {
    const data = await db
      .delete(schema.blackList)
      .where(
        and(
          eq(schema.blackList.userId, userId),
          eq(schema.blackList.blockedUserId, blockedUserId)
        )
      )
      .returning({ id: schema.blackList.id });
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to remove user from black list.');
  }
}

export async function userInBlackList(userId: number, blockedUserId: number) {
  const data = await db.query.blackList.findFirst({ 
    columns: { id: true },
    where: and(
      eq(schema.blackList.userId, userId),
      eq(schema.blackList.blockedUserId, blockedUserId),
    )
  });

  return !!data?.id;
}

// ------------ QUESTS ------------
export async function fetchQuestById(id: number, relations?: schema.QuestRealation[]) {
  try {
    let withObject: any;
    if (relations && relations.length) {
      withObject = {};
      relations.map((relation) => {
        withObject[relation] = true;
      })
    }

    const data = await db.query.quests.findFirst({ 
      where: eq(schema.quests.id, id),
      ...(withObject && { with: withObject })
    });
    
    return data as Quest;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quest data.');
  }
}

export async function fetchEarnQuestsByUserId(userId: number) { // TODO?: refactor 'active' for app service and check 'active'
  try {
    const sq = db.select({ 
      rowCount: count(schema.questEarnings.id),
    })
    .from(schema.questEarnings)
    .where(
      and(
        eq(schema.questEarnings.userId, userId),
        eq(schema.questEarnings.questId, schema.quests.id),
        sql`${schema.questEarnings.createdAt}::date = CURRENT_DATE`
      )
    )
    .as('sq');

    const data = await db
      .select({
        ...getTableColumns(schema.quests), 
        doneCountToday: sql`${sq}`.mapWith(Number),
        doneLastAt: max(schema.questEarnings.createdAt),
        service: getTableColumns(schema.services),
        action: getTableColumns(schema.actions),
        serviceAction: getTableColumns(schema.serviceActions),
      })
      .from(schema.quests)
      .leftJoin(schema.serviceActions, eq(schema.serviceActions.id, schema.quests.serviceActionId))
      .leftJoin(schema.services, eq(schema.services.id, schema.serviceActions.serviceId))
      .leftJoin(schema.actions, eq(schema.actions.id, schema.serviceActions.actionId))
      .leftJoin(schema.questEarnings, 
        and(
          eq(schema.questEarnings.userId, userId),
          eq(schema.questEarnings.questId, schema.quests.id),
        )
      )
      .where(
        and(
          eq(schema.quests.active, true),
        )
      )
      .groupBy(schema.quests.id, schema.serviceActions.id, schema.services.id, schema.actions.id)
      .orderBy(desc(schema.quests.priority))
    ;

    return data as Quest[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch quests data.');
  }
}

// ------------ QUESTS EARNINGS ------------
export async function createQuestEarning(dto: dto.QuestEarningInsertDTO) {
  try {
    const data = await db
      .insert(schema.questEarnings)
      .values(dto)
      .returning({ id: schema.questEarnings.id })
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to insert data.');
  }
}

export async function createQuestEarningWithBalanceUpdate(dto: dto.QuestEarningInsertDTO, balance: number) {
  try {
    const batch = await db.batch([ // TODO?: tx?
      db.insert(schema.questEarnings).values(dto).returning({ id: schema.questEarnings.id }),
      updateUserQuery(dto.userId, { balance: balance }),
    ]);

    return { 
      questEarningId: batch[0][0].id, 
      updatedUser: batch[1][0] as User 
    };
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchLastDateUserDoneQuest(userId: number, questId: number) {
  try {
    const data = await db.query.questEarnings.findFirst({ 
      columns: { createdAt: true },
      where: and(
        eq(schema.questEarnings.userId, userId),
        eq(schema.questEarnings.questId, questId),
      ),
      orderBy: desc(schema.questEarnings.createdAt)
    })

    return data?.createdAt as Date;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch tasks data.');
    }
}

export async function fetchQuestDoneCountTodayByUserAndQuestId(userId: number, questId: number) {
  try {
    const data = await db.$count(schema.questEarnings, 
      and(
        eq(schema.questEarnings.userId, userId),
        eq(schema.questEarnings.questId, questId),
        sql`${schema.questEarnings.createdAt}::date = CURRENT_DATE`
      )
    );

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function fetchQuestDoneCountByUserId(userId: number) {
  try {
    const data = await db.$count(schema.questEarnings, 
      and(
        eq(schema.questEarnings.userId, userId),
      )
    );

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}


// ------------ SHOP ------------

export async function fetchProducts(active?: boolean) {
  try {
    const data = await db.query.products.findMany({ 
      orderBy: [desc(schema.products.priority)],
      ...(active !== undefined && { where: eq(schema.actions.active, active) })
    });

    return data as Product[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products data.');
  }
}

export async function fetchProductById(id: number) {
  try {
    const data = await db.query.products.findFirst({ where: eq(schema.products.id, id) });

    return data as Product;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product data.');
  }
}

export async function createPayment(dto: dto.PaymentInsertDTO, tx?: any) {
  try {
    const con = tx ?? db;
    const data = await con.insert(schema.payments).values(dto).returning({ id: schema.payments.id });

    return data[0].id;
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create payment.');
  }
}



//- - - - - - - - - - - - -
// TODO?
// SELECT (CURRENT_DATE - '2025-01-27 22:00:01.870075'::date) AS difference_in_days; # days between midnight
// SELECT DATE_PART('day', CURRENT_TIMESTAMP - '2025-01-27 07:46:01.870075'::timestamp) AS days; # days beetwen time
// export async function questCheckDaily(userId: number, questId: number) { // TODO?: fetchLastDateUserDoneQuest
//   try {
//     const [data] = await db
//       .select({
//         dailyCheck: sql<boolean>`DATE_PART('day', CURRENT_TIMESTAMP - MAX(${schema.questEarnings.createdAt})::timestamp) > 0`,
//       })
//       .from(schema.questEarnings)
//       .where(
//         and(
//           eq(schema.questEarnings.userId, userId),
//           eq(schema.questEarnings.questId, questId),
//         )
//       )
//     ;
//     return data.dailyCheck === null ? true : data.dailyCheck;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to exucute query.');
//   }
// }
//- - - - - - - - - - - - -

// export async function deleteTask(id: number) {
//   try {
//     const data = await db
//       .update(schema.tasks)
//       .set({ status: TaskStatusEnum.DELETED, updatedAt: sql`NOW()`, deletedAt: sql`NOW()` })
//       .where(eq(schema.tasks.id, id))
//       .returning({ id: schema.tasks.id });
//     return data[0]?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to delete task.');
//   }
// }

// export async function userCanTask(taskId: number, userId: number) {
//   const data = await db.query.tasks.findFirst({ 
//     columns: { id: true },
//     where: and(
//       eq(schema.tasks.id, taskId),
//       eq(schema.tasks.status, TaskStatusEnum.ACTIVE),
//       ne(schema.tasks.userId, userId),
//     )
//   });
//   return !!data?.id;
// }
// export async function userDoneTask(taskId: number, userId: number) {
//   const data = await db.query.taskEarnings.findFirst({ 
//     columns: { id: true },
//     where: and(
//       eq(schema.taskEarnings.taskId, taskId),
//       eq(schema.taskEarnings.userId, userId),
//     )
//   });
//   return !!data?.id;
// }
// export async function userReportedTask(taskId: number, userId: number) {
//   const data = await db.query.reports.findFirst({ 
//     columns: { id: true },
//     where: and(
//       eq(schema.taskEarnings.taskId, taskId),
//       eq(schema.taskEarnings.userId, userId),
//     )
//   });
//   return !!data?.id;
// }

// -------- tx

// dolshe na paru seconds chem batch. Hotya tut vatiant bolee gibkiy
// export async function createTaskWithBalanceUpdate(dto: dto.TaskInsertDTO, balance: number) {
//   try {
//     const result = await dbPool.transaction(async (tx) => {
//       try {
//         await createTask(dto, tx);
//         await updateUserWithSession(dto.userId, { balance: balance }, tx);
//       } catch (error) {
//         console.log('Transaction error:', error);
//         tx.rollback();
//       }
//     });
//     return result;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to create task.');
//   }
// }

// export async function createQuestEarningWithBalanceUpdate(dto: dto.QuestEarningInsertDTO, balance: number) {
//   try {
//     const result = await dbPool.transaction(async (tx) => {
//       try {
//         await Promise.all([
//           createQuestEarning(dto, tx), 
//           updateUserWithSession(dto.userId, { balance: balance }, tx)
//         ]);
//       } catch (error) {
//         console.log('Transaction error:', error);
//         tx.rollback();
//       }
//     });
//     return result;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to insert data.');
//   }
// }