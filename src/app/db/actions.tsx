import { z } from 'zod';
import { cache } from 'react';
import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache'; 
import { redirect } from 'next/navigation';
import { depositFormSchema, userSchema } from './schema';
import { DepostitFormState } from '../lib/definitions';

import { sql } from './connection';

import { UserContext } from '../components/providers/user-provider';
import { useContext } from "react";

// const sql = neon(`${process.env.DATABASE_URL}`);

export async function updateUserBalance(prevState: DepostitFormState, formData: FormData) {
  // const validator = depositFormSchema.omit({ address: true, reward: true });
  console.log('updateUserBalance');

  const { id, balance, updateUser } = useContext(UserContext);
  
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
  
  const newBalance = balance + amount;
  // const balance = 8 + amount;
  // const amountInCents = amount * 100;

  try {
    await sql(`UPDATE users SET balance = ${balance} WHERE id = ${id}`);
    updateUser({balance: newBalance});
  } catch (error) {
    return {
      message: 'Database Error: Failed to update balance.',
    };
  }
  
  revalidatePath('/wallet');
  redirect('/wallet');
}