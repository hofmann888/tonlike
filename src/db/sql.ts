'use server'

import { Action, Service, User } from '@/lib/definitions';
import { sql } from './connection';

export async function fetchServices() {
  try {
    const data = await sql(`SELECT * FROM services;`);
    return data as Service[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchActions() {
  try {
    const data = await sql(`SELECT * FROM actions;`);
    return data as Action[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function createUser(tg_id: number) {
  try {
    console.log('createUser');
    const [data] = await sql(`INSERT INTO users (tg_id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING *;`, [tg_id]);
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

    let setString = '';
    let values: any = [];
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

export async function fetchUserByTgId(tg_id: number) {
  try {
    console.log('fetchUserByTgId');
    const [data] = await sql(`SELECT * FROM users WHERE tg_id = $1;`, [tg_id]);
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