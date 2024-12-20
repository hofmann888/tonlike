'use server'

// import { z } from 'zod';
// import { cache } from 'react';
import { neon } from '@neondatabase/serverless';
import { Action, Service, User } from '@/lib/definitions';
import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation';

// import { depositFormSchema, userSchema } from './schema';
import { depositFormSchema } from './schema';
import { DepostitFormState } from '@/lib/definitions';

const sql = neon(`${process.env.DATABASE_URL}`);

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

export async function fetchUserByTgId(tg_id: number) {
  try {
    console.log('fetchUserByTgId');
    const [data] = await sql(`SELECT * FROM users WHERE tg_id = $1;`, [tg_id]);
    console.log(data);
    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchUserByAddress(address: string) {
  try {
    const [data] = await sql(`SELECT * FROM users WHERE address = $1;`, [address]);
    return data as User;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function updateUserBalance(id: number | null, balance: number, prevState: DepostitFormState, formData: FormData) {
  // const validator = depositFormSchema.omit({ address: true, reward: true });

  console.log('updateUserBalance');
  
  const validated = depositFormSchema.safeParse({
    amount: formData.get('amount'),
  });

  console.log('validated:');
  console.log(validated);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Failed to update balance.',
    };
  }

  const { amount } = validated.data;
  
  balance += amount;
  // const balance = 8 + amount;
  // const amountInCents = amount * 100;

  try {
    await sql(`UPDATE users SET balance = ${balance} WHERE id = ${id}`);
  } catch (error) {
    return {
      message: 'Database Error: Failed to update balance.',
    };
  }
  
  revalidatePath('/wallet');
  redirect('/wallet');
}