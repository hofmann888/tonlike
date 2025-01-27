'use server'

// import 'server-only'; // TODO!

import { Action, Performer, Service, Task, TaskStatusEnum, User } from '@/lib/definitions';
import { sql, and, eq, ne, gt, isNull, asc, desc, getTableColumns } from 'drizzle-orm';
import { db } from './db';
import * as schema from './schema';
import * as dto from './dto';

// TODO: errors
// ? Failed to (fetch|update|insert|delete data) | (execute query)
// ? dto -> ...Data

// !? split comlicated queries to separate and execute the in parallel Promise.all() # zatestil: odnohuistvenno po time

// ------------ USERS ------------
export async function createUser(dto: dto.UserInsertDTO) {
  console.log('createUser');
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

export async function updateUser(id: number, dto: dto.UserUpdateDto) {
  console.log('updateUser');

  try {
    const data = await db
      .update(schema.users)
      .set({ ...dto, updatedAt: sql`NOW()` })
      .where(eq(schema.users.id, id))
      .returning();

    return data[0] as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update user data.');
  }
}

export async function fetchUserByTgId(tgId: number) {
  console.log('fetchUserByTgId');
  try {
    const data = await db.query.users.findFirst({ where: eq(schema.users.tgId, tgId) });

    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchUserReferrals(userId: number) {
  console.log('fetchUserReferrals');
  try {
    const data = await db.query.users.findMany({ 
      where: eq(schema.users.referrerId, userId),
      orderBy: [desc(schema.users.createdAt)] 
    });  // TODO!?: select only needed fields?

    return data as User[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch referrals data.');
  }
}

export async function fetchUsersLeaderboard() {
  console.log('fetchUsersLeaderboard');
  try {
    const data = await db.query.users.findMany({ orderBy: [desc(schema.users.balance)] });  // TODO!?: select only needed fields?

    return data as User[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch users data.');
  }
}

// ------------ ACTIONS ------------ 
export async function fetchActions(active?: boolean) {
  console.log('fetchActions');
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
  console.log('fetchActionById');
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
  console.log('fetchServices');
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
  console.log('fetchServiceById');
  try {
    const data = await db.query.actions.findFirst({ where: eq(schema.services.id, id) });

    return data as Service;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service data.');
  }
}

export async function fetchServicesWithActions(active?: boolean) {
  console.log('fetchServicesWithActions');
  try {
    const data = await db.query.services.findMany({ 
      with: { 
        serviceActions: { 
          columns: {},
          where: eq(schema.serviceActions.active, true),
          with: { 
            action: true,
          } 
        } 
      },
      orderBy: [asc(schema.services.id)],
      ...(active !== undefined && { where: eq(schema.actions.active, active) })
    });
  
    // const data = await prepared.execute(); // TODO?
    const formatedData = [] as Service[];
  
    if (data.length) {
      data.map((dataItem) => { // TODO?: DTO
        const service = { 
          id: dataItem.id, 
          name: dataItem.name, 
          icon: dataItem.icon, 
          active: dataItem.active, 
          actions: [] as Action[] 
        };
        if (dataItem.serviceActions.length) {
          dataItem.serviceActions.map((serviceAction) => {
            service.actions.push(serviceAction.action as Action);
          })
        }
        formatedData.push(service as Service);
      });
    }
  
    return formatedData as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services data.');
  }
}

// ------------ TASKS ------------
export async function createTask(dto: dto.TaskInsertDTO) {
  console.log('createTask');
  try {
    const data = await db.insert(schema.tasks).values(dto).returning({ id: schema.tasks.id });

    return data[0].id;
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create task.');
  }
}

export async function updateTask(id: number, dto: dto.TaskUpdateDTO) {
  console.log('updateTask');
  try {
    const data = await db
      .update(schema.tasks)
      .set({ ...dto, updatedAt: sql`NOW()` }) // TODO?: check if dto is empty
      .where(eq(schema.tasks.id, id))
      .returning({ id: schema.tasks.id }) // TODO?: return Task?
    ;

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update task data.');
  }
}

export async function deleteTask(id: number) {
  console.log('deleteTask');
  try {
    const data = await db
      .update(schema.tasks)
      .set({ status: TaskStatusEnum.DELETED, deletedAt: sql`NOW()` }) // TODO?: updatedAt?
      .where(eq(schema.tasks.id, id))
      .returning({ id: schema.tasks.id });

    return data[0]?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete task.');
  }
}

export async function fetchTaskById(id: number) {
  try {
    const data = await db.query.tasks.findFirst({ where: eq(schema.tasks.id, id) });
    
    return data as Task;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch task data.');
  }
}

export async function fetchTasksByUserId(userId: number) {
  console.log('fetchTasksByUserId');
  try {
    const data = await db.query.tasks.findMany({ 
      where: eq(schema.tasks.userId, userId),
      with: {
        action: true,
        service: true,
      },
      orderBy: [desc(schema.tasks.createdAt)],
    });

    return data as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tasks data.');
  }
}

export async function fetchEarnTasksByUserId(userId: number) {
  console.log('fetchEarnTasksByUserId');
  try {
    const data = await db
      .select({
        ...getTableColumns(schema.tasks), 
        service: getTableColumns(schema.services),
        action: getTableColumns(schema.actions),
      })
      .from(schema.tasks)
      .leftJoin(schema.services, eq(schema.services.id, schema.tasks.serviceId))
      .leftJoin(schema.actions, eq(schema.actions.id, schema.tasks.actionId))
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
      .where(
        and(
          ne(schema.tasks.userId, userId),
          eq(schema.tasks.status, TaskStatusEnum.ACTIVE),
          isNull(schema.reports.id),
          isNull(schema.taskEarnings.id),
        )
      )
      .orderBy(desc(schema.tasks.createdAt))
    ;

    return data as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch earn tasks data.');
  }
}

export async function fetchTaskPerformers(taskId: number) {
  console.log('fetchTaskPerformers');
  try {
    const data = await db
      .select({
        id: schema.users.id,
        tgUsername: schema.users.tgUsername,
        tgPhotoUrl: schema.users.tgPhotoUrl,
        doneAt: schema.taskEarnings.createdAt,
        isBlocked: sql`CASE WHEN black_list.id IS NOT NULL THEN TRUE ELSE FALSE END`.as('is_blocked'),
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
  console.log('userHasTask');
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
  console.log('taskIsAvailableForUser');
  try {
    // TODO!?: split on defferent queries and execute Promise.all() ? # po vremeni odna huinya...hzhz...
    // const [can, done, reported, blocked] = await Promise.all([
    //   userCanTask(taskId, userId), 
    //   userDoneTask(taskId, userId), 
    //   userReportedTask(taskId, userId);
    //   userInBlackList(taskUserId, userId)
    // ]);
    // return can && !done && !reported && !blocked;

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

// ------------ TASK EARNINGS ------------
export async function hideTaskEarningForUser(userId: number, taskId: number) { // TODO?: isHidden?
  console.log('hideUserEarning');
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

// ------------ REPORTS ------------
export async function createReport(dto: dto.ReportInsertDTO) {
  console.log('createReport');
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
export async function addUserToBlackList(dto: dto.BlackListInsertDTO) { // TODO!?: limit on blocked users  
  console.log('addUserToBlackList');
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
  console.log('removeUserFromBlackList');
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

// TODO?: separate parallel queries? # skoree uzh taskId naxui vipilit'...
// export async function performerCanBeBlocked(userId: number, blockUserId: number, taskId: number) {
//   console.log('performerCanBeBlocked');
//   try {
//     const data = await db
//       .select({
//         id: schema.taskEarnings.id,
//       })
//       .from(schema.taskEarnings)
//       .leftJoin(schema.blackList, 
//         and(
//           eq(schema.blackList.userId, userId),
//           eq(schema.blackList.blockedUserId, blockUserId)
//         )
//       )
//       .where(
//         and(
//           eq(schema.taskEarnings.userId, blockUserId),
//           eq(schema.taskEarnings.taskId, taskId),
//           gt(schema.taskEarnings.profit, 0),
//           isNull(schema.blackList.id),
//         )
//       )
//       .limit(1)
//       .orderBy(desc(schema.taskEarnings.createdAt))
//     ;

//     return !!data[0]?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to execute query.');
//   }
// }