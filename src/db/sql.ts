'use server'

import 'server-only';

import { sql } from './connection';
import { formatUserTaskDTO } from './dto';
import { Action, Service, Task, TaskDTO, TaskStatus, TaskStatusEnum, User } from '@/lib/definitions';
import { User as tgUser } from '@telegram-apps/sdk-react';

export async function fetchActions() {
  try {
    const data = await sql(`SELECT * FROM actions ORDER BY id;`);
    return data as Action[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch actions data.');
  }
}

export async function fetchActionById(id: number) {
  try {
    const [data] = await sql(`SELECT * FROM actions WHERE id = $1;`, [id]);
    return data as Action;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch action data.');
  }
}

export async function fetchServices() {
  try {
    const data = await sql(`SELECT * FROM services ORDER BY id;`);
    return data as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services data.');
  }
}

export async function fetchServicesWithActionIds() {
  try {
    console.log('fetchServicesWithActionIds');
    const data = await sql(`
      SELECT 
        services.*, 
        array_agg(service_actions.action_id ORDER BY service_actions.action_id) as "actionIds" 
      FROM services 
      LEFT JOIN service_actions ON services.id = service_actions.service_id
      WHERE services.active = true AND service_actions.active = true
      GROUP BY services.id
      ORDER BY services.id;
    `);
    return data as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch services data.');
  }
}

export async function fetchServiceById(id: number) {
  try {
    const [data] = await sql(`SELECT * FROM services WHERE id = $1;`, [id]);
    return data as Service;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch service data.');
  }
}

export async function createTask(taskData: any) {
  try {
    console.log('createTask');
    const [data] = await sql(
      `INSERT INTO tasks (user_id, action_id, service_id, link, price, count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
      [taskData.userId, taskData.actionId, taskData.serviceId, taskData.link, taskData.price, taskData.count]
    );
    console.log('createTask data'); console.log(data);
  } catch (error ) {
    console.error('Database Error:', error);
    throw new Error('Failed to create task.');
  }
}

export async function fetchUserTasks(userId: number) {
  try {
    console.log('fetchUserTasks');
    const data = await sql(`
      SELECT 
        tasks.*, 
        actions.name as action_name, actions.reward as action_reward,
        services.name as service_name, services.img as service_img
      FROM tasks 
      LEFT JOIN actions on tasks.action_id = actions.id 
      LEFT JOIN services on tasks.service_id = services.id 
      WHERE tasks.user_id = $1
      ORDER BY tasks.created_at DESC;
    `, [userId]);

    const formatedData: Task[] = []; 

    if (data) {
      data.map((dataTask) => {
        const task = formatUserTaskDTO(dataTask as TaskDTO);
        formatedData.push(task);
      });
    }
    return formatedData as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch action data.');
  }
}

export async function fetchUserEarnTasks(userId: number) {
  try {
    console.log('fetchUserEarnTasks');
    const data = await sql(`
      SELECT 
        tasks.*, 
        actions.name as action_name, actions.reward as action_reward,
        services.name as service_name, services.img as service_img
      FROM tasks 
      LEFT JOIN actions on tasks.action_id = actions.id 
      LEFT JOIN services on tasks.service_id = services.id
      LEFT JOIN tasks_done on tasks.id = tasks_done.task_id 
      WHERE tasks.user_id != $1 AND tasks_done.id IS NULL
      ORDER BY tasks.created_at DESC;
    `, [userId]);

    const formatedData: Task[] = []; 

    if (data) {
      data.map((dataTask) => {
        const task = formatUserTaskDTO(dataTask as TaskDTO);
        formatedData.push(task);
      });
    }
    return formatedData as Task[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch action data.');
  }
}

export async function updateTaskStatus(taskId: number, status: TaskStatus) {
  try {
    console.log('updateTaskStatus');
    const [data] = await sql(`UPDATE tasks SET status = $1 WHERE id = $2 RETURNING id;`, [status, taskId]);
    console.log('updateTaskStatus data:', data);
    return data?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function deleteTask(taskId: number) {
  try {
    console.log('deleteTask');
    const [data] = await sql(`UPDATE tasks SET status = $1, deleted_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id;`, [TaskStatusEnum.DELETED, taskId]);
    console.log('deleteTask data:', data);
    return data?.id;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function userHasTask(taskId: number, userId: number) {
  try {
    console.log('userHasTask');
    const [data] = await sql(`SELECT EXISTS (SELECT 1 FROM tasks WHERE id = $1 AND user_id = $2);`, [taskId, userId]);
    console.log('userHasTask data:', data);
    return data?.exists;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to execute query.');
  }
}

export async function createUserByTg(tgUser: tgUser) {
  try {
    console.log('createUser');
    const [data] = await sql(
      `INSERT INTO users (tg_id, tg_username, tg_photo_url) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *;`, 
      [tgUser.id, tgUser.username, tgUser.photoUrl]
    );
    console.log('createUser data'); console.log(data);
    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function updateUserById(id: number, fields: any) {
  console.log('updateUserById');

  try {
    if (!fields) {
      throw new Error('No fields specified on update ')
    }

    const values: any = [];
    let setString = '';
    let varIdx = 1;
    for (const key in fields) {
      setString += `${key} = $${varIdx}, `
      values.push(fields[key]);
      varIdx++;
    }
    setString = setString.slice(0, -2);
    values.push(id);

    const [data] = await sql(`UPDATE users SET ${setString} WHERE id = $${varIdx} RETURNING *;`, values);
    console.log('updateUserById data:', data);
    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to update user data.');
  }
}

export async function fetchUserByTgId(tgId: number) {
  try {
    console.log('fetchUserByTgId');
    const [data] = await sql(`SELECT * FROM users WHERE tg_id = $1;`, [tgId]);
    console.log(data);
    return data as User; // User | undefined
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchUserByAddress(address: string) {
  try {
    const [data] = await sql(`SELECT * FROM users WHERE address = $1;`, [address]);
    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fetchUsersLeaderboard() {
  try {
    console.log('fetchUsers');
    const data = await sql(`SELECT * FROM users ORDER BY reward DESC;`);
    console.log('fetchUsers data:', data);
    return data as User[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}