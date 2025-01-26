// 'use server'

// // import 'server-only';

// // import { neon } from '@neondatabase/serverless';
// import { sql } from './db';
// import { Action, Performer, Report, Service, Task, TaskDTO, TaskStatus, TaskStatusEnum, User, TaskEarningStatusEnum } from '@/lib/definitions';
// import { User as tgUser } from '@telegram-apps/sdk-react';

// export async function fetchActions() {
//   console.log('fetchActionsSql');
//   try {
//     const data = await sql(`SELECT * FROM actions ORDER BY id;`);
//     return data as Action[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch actions data.');
//   }
// }

// export async function fetchActionById(id: number) {
//   try {
//     const [data] = await sql(`SELECT * FROM actions WHERE id = $1;`, [id]);
//     return data as Action;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch action data.');
//   }
// }

// export async function fetchServices() {
//   try {
//     const data = await sql(`SELECT * FROM services ORDER BY id;`);
//     return data as Service[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch services data.');
//   }
// }

// export async function fetchServicesWithActionIds() {
//   try {
//     console.log('fetchServicesWithActionIdsSQL');
// //     const data = await db // TODO?
// //       .select({
// //         id: schema.services.id,
// //         name: schema.services.name,
// //         icon: schema.services.icon,
// //         active: schema.services.active,
// //         actionIds: sql`array_agg(service_actions.action_id ORDER BY service_actions.action_id)`.as('action_ids'),
// //       })
// //       .from(schema.services)
// //       .leftJoin(schema.serviceActions, eq(schema.serviceActions.id, schema.services.id))
// //       .where(
// //         and(
// //           eq(schema.services.active, true),
// //           eq(schema.serviceActions.active, true)
// //         )
// //       )
// //       .groupBy(schema.services.id)
// //       .orderBy(schema.services.id)
// //     ;
//     const data = await sql(`
//       SELECT 
//         services.*, 
//         array_agg(service_actions.action_id ORDER BY service_actions.action_id) as "actionIds" 
//       FROM services 
//       LEFT JOIN service_actions ON services.id = service_actions.service_id
//       WHERE services.active = true AND service_actions.active = true
//       GROUP BY services.id
//       ORDER BY services.id;
//     `);
//     return data as Service[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch services data.');
//   }
// }

// export async function fetchServiceById(id: number) {
//   try {
//     const [data] = await sql(`SELECT * FROM services WHERE id = $1;`, [id]);
//     return data as Service;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch service data.');
//   }
// }

// export async function createTask(taskData: any) {
//   try {
//     console.log('createTask');
//     const [data] = await sql(
//       `INSERT INTO tasks (user_id, action_id, service_id, link, price, count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
//       [taskData.userId, taskData.actionId, taskData.serviceId, taskData.link, taskData.price, taskData.count]
//     );
//     console.log('createTask data'); console.log(data);
//   } catch (error ) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to create task.');
//   }
// }

// export async function fetchTaskById(id: number) {
//   try {
//     const [data] = await sql(`SELECT * FROM tasks WHERE id = $1;`, [id]);
//     return data as Task; // TODO?: relations? Use TaskDTO? separate models for Task and TaskWithRelations?
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch service data.');
//   }
// }

// export async function fetchUserTasks(userId: number) {
//   try {
//     console.log('fetchUserTasks');
//     const data = await sql(`
//       SELECT 
//         tasks.*, 
//         actions.name as action_name,
//         services.name as service_name, services.img as service_img
//       FROM tasks 
//       LEFT JOIN actions on tasks.action_id = actions.id 
//       LEFT JOIN services on tasks.service_id = services.id 
//       WHERE tasks.user_id = $1
//       ORDER BY tasks.created_at DESC;
//     `, [userId]);

//     const formatedData: Task[] = []; 

//     if (data) {
//       data.map((dataTask) => {
//         const task = formatUserTaskDTO(dataTask as TaskDTO);
//         formatedData.push(task);
//       });
//     }
//     return formatedData as Task[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch action data.');
//   }
// }

// export async function fetchUserEarnTasks(userId: number) {
//   try {
//     console.log('fetchUserEarnTasks');
//     const data = await sql(`
//       SELECT 
//         tasks.*, 
//         actions.name as action_name,
//         services.name as service_name, services.icon as service_icon
//       FROM tasks 
//       LEFT JOIN actions on actions.id = tasks.action_id
//       LEFT JOIN services on services.id = tasks.service_id
//       LEFT JOIN task_earnings on task_earnings.task_id = tasks.id AND task_earnings.user_id = $1
//       LEFT JOIN reports on reports.task_id = tasks.id AND reports.user_id = $1
//       WHERE tasks.user_id != $1 AND tasks.status = $2 AND task_earnings.id IS NULL AND reports.id IS NULL
//       ORDER BY tasks.created_at DESC;
//     `, [userId, TaskStatusEnum.ACTIVE]);

//     const formatedData: Task[] = []; 

//     if (data) {
//       data.map((dataTask) => {
//         const task = formatUserTaskDTO(dataTask as TaskDTO);
//         formatedData.push(task);
//       });
//     }
//     return formatedData as Task[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user earn tasks.');
//   }
// }

// export async function updateTaskSum(taskId: number, price: number, count: number) { // TODO: refactor
//   try {
//     console.log('updateTaskSum');
//     const [data] = await sql(`UPDATE tasks SET price = $1, count = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id;`, [price, count, taskId]);
//     console.log('updateTaskSum data:', data);
//     return data?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to update task status.');
//   }
// }

// export async function updateTaskStatus(taskId: number, status: TaskStatus) {
//   try {
//     console.log('updateTaskStatus');
//     const [data] = await sql(`UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id;`, [status, taskId]);
//     console.log('updateTaskStatus data:', data);
//     return data?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to update task status.');
//   }
// }

// export async function deleteTask(taskId: number) {
//   try {
//     console.log('deleteTask');
//     const [data] = await sql(`UPDATE tasks SET status = $1, deleted_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id;`, [TaskStatusEnum.DELETED, taskId]);
//     console.log('deleteTask data:', data);
//     return data?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to delete task.');
//   }
// }

// export async function userHasTask(taskId: number, userId: number) {
//   try {
//     console.log('userHasTask');
//     const [data] = await sql(`SELECT EXISTS (SELECT 1 FROM tasks WHERE id = $1 AND user_id = $2);`, [taskId, userId]);
//     console.log('userHasTask data:', data);
//     return data?.exists;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to execute query.');
//   }
// }

// export async function createUserByTg(tgUser: tgUser) {
//   try {
//     console.log('createUser');
//     const [data] = await sql(
//       `INSERT INTO users (tg_id, tg_username, tg_photo_url) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *;`, 
//       [tgUser.id, tgUser.username, tgUser.photoUrl]
//     );
//     console.log('createUser data'); console.log(data);
//     return data as User;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to create user.');
//   }
// }

// export async function updateUserById(id: number, fields: any) {
//   console.log('updateUserById');

//   try {
//     if (!fields) {
//       throw new Error('No fields specified on update ')
//     }

//     const values: any = [];
//     let setString = '';
//     let varIdx = 1;
//     for (const key in fields) {
//       setString += `${key} = $${varIdx}, `
//       values.push(fields[key]);
//       varIdx++;
//     }
//     setString = setString.slice(0, -2);
//     values.push(id);

//     const [data] = await sql(`UPDATE users SET updated_at = CURRENT_TIMESTAMP, ${setString} WHERE id = $${varIdx} RETURNING *;`, values);
//     console.log('updateUserById data:', data);
//     return data as User;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to update user data.');
//   }
// }

// export async function fetchUserByTgId(tgId: number) {
//   try {
//     console.log('fetchUserByTgId');
//     const [data] = await sql(`SELECT * FROM users WHERE tg_id = $1;`, [tgId]);
//     console.log(data);
//     return data as User; // User | undefined
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user data.');
//   }
// }

// export async function fetchUserByAddress(address: string) {
//   try {
//     const [data] = await sql(`SELECT * FROM users WHERE address = $1;`, [address]);
//     return data as User;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user data.');
//   }
// }

// export async function fetchUsersLeaderboard() {
//   try {
//     console.log('fetchUsers');
//     const data = await sql(`SELECT * FROM users ORDER BY balance DESC;`); // TODO?: select only needed fields
//     console.log('fetchUsers data:', data);
//     return data as User[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user data.');
//   }
// }

// export async function fetchUserRefs(userId: number) {
//   try {
//     console.log('fetchUserRefs');
//     const data = await sql(`
//       SELECT * FROM users
//       LEFT JOIN user_refs on user_refs.ref_user_id = users.id
//       WHERE user_refs.user_id = $1
//       ORDER BY user_refs.created_at ASC;`, 
//       [ userId ]
//     );
//     console.log('fetchUserRefs data:', data);
//     return data as User[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch referrals data.');
//   }
// }

// export async function fetchTaskPerformers(taskId: number, taskUserId: number) {
//   try {
//     console.log('fetchTaskPerformers');
//     const data = await sql(`
//       SELECT
//         users.id, users.tg_username, users.tg_photo_url,
//         user_earnings.created_at,
//         CASE 
//           WHEN black_list.id IS NOT NULL THEN TRUE 
//           ELSE FALSE 
//         END AS is_blocked
//       FROM user_earnings 
//       LEFT JOIN users ON users.id = user_earnings.user_id
//       LEFT JOIN black_list ON black_list.blocked_user_id = user_earnings.user_id AND black_list.user_id = $1
//       WHERE user_earnings.task_id = $2 AND user_earnings.status = $3;`, 
//       [taskUserId, taskId, TaskEarningStatusEnum.DONE]
//     );

//     console.log('fetchTaskPerformers data:', data);
//     return data as Performer[];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch user data.');
//   }
// }

// export async function performerCanBeBlocked(userId: number, blockUserId: number, taskId: number) {
//   try {
//     console.log('performerCanBeBlocked');
//     const [data] = await sql(`
//       SELECT EXISTS (
//         SELECT 1 FROM user_earnings 
//         LEFT JOIN black_list ON black_list.user_id = $1 AND black_list.blocked_user_id = $2
//         WHERE user_earnings.user_id = $2 AND user_earnings.task_id = $3 AND black_list.id IS NULL
//       );`, 
//       [userId, blockUserId, taskId]
//     );
//     console.log('performerCanBeBlocked data:', data);
//     return !!data?.exists;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to execute query.');
//   }
// }

// export async function addUserToBlackList(blackListData: any) {
//   try {
//     console.log('addUserToBlackList');
//     const [data] = await sql(
//       `INSERT INTO black_list (user_id, blocked_user_id, task_id, reasons, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
//       [blackListData.userId, blackListData.blockUserId, blackListData.taskId, blackListData.reasons, blackListData.comment]
//     );
//     console.log('addUserToBlackList data:', data);
//     return data as Report;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to insert data.');
//   }
// }

// export async function removeUserFromBlackList(userId: number, blockedUserId: number) {
//   try {
//     console.log('removeUserFromBlackList');
//     const [data] = await sql(`DELETE FROM black_list WHERE user_id = $1 AND blocked_user_id = $2 RETURNING id;`, [userId, blockedUserId]);
//     console.log('removeUserFromBlackList data:', data);
//     return data?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to delete task.');
//   }
// }

// export async function checkUserEarnTask(userId: number, taskId: number) {
//   try {
//     console.log('checkUserEarning');
//     const [data] = await sql(`
//       SELECT EXISTS (
//         SELECT 1 FROM tasks 
//         LEFT JOIN user_earnings on tasks.id = user_earnings.task_id AND user_earnings.user_id = $1
//         WHERE tasks.id = $2 AND tasks.user_id != $1 AND tasks.status = $3 AND user_earnings.id IS NULL
//       );`, 
//       [userId, taskId, TaskStatusEnum.ACTIVE]
//     );
//     console.log('checkUserEarning data:', data);
//     return data?.exists;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to execute query.');
//   }
// }

// export async function hideUserEarning(userId: number, taskId: number) {
//   try {
//     console.log('hideUserEarning');
//     const [data] = await sql(`INSERT INTO user_earnings (user_id, task_id, status) VALUES ($1, $2, $3) RETURNING id;`, 
//       [userId, taskId, TaskEarningStatusEnum.HIDDEN]
//     );
//     console.log('hideUserEarning data:', data);
//     return data?.id;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to insert data.');
//   }
// }

// export async function createReport(reportData: any) {
//   try {
//     console.log('createReport');
//     const [data] = await sql(
//       `INSERT INTO reports (user_id, task_id, reasons, comment) VALUES ($1, $2, $3, $4) RETURNING *;`, 
//       [reportData.userId, reportData.taskId, reportData.reasons, reportData.comment]
//     );
//     console.log('createReport data:', data);
//     return data as Report;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to insert data.');
//   }
// }






// // export function formatUserTaskDTO(dto: TaskDTO) {
// //   return {
// //     id: dto?.id,
// //     link: dto?.link,
// //     price: dto?.price,
// //     // currency: dto?.currency,
// //     count: dto?.count,
// //     done: dto?.done,
// //     status: dto?.status,
// //     created_at: dto?.created_at, // TODO: not timestamp? - 2024-12-24T03:00:32.276Z,
// //     updated_at: dto?.updated_at,
// //     deleted_at: dto?.deleted_at,
// //     user_id: dto?.user_id,
// //     action: {
// //       id: dto?.action_id,
// //       name: dto?.action_name,
// //     } as Action,
// //     service: {
// //       id: dto?.service_id,
// //       name: dto?.service_name,
// //       img: dto?.service_img,
// //     } as Service,
// //   } as Task;
// // }