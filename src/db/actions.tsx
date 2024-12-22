'use server'

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache'; 
import { depositFormSchema } from './schema';
import { DepostitFormState } from '@/lib/definitions';
import { getSession, setSession } from '@/app/init-data/auth/session';
import { updateUserById } from './sql';

export async function updateUserBalance(prevState: DepostitFormState, formData: FormData) {
  console.log('updateUserBalance');

  try {
    const { user } = await getSession();
    if (!user) {
      throw new Error('Not authorized!');
    }

    const validated = depositFormSchema.safeParse({
      amount: formData.get('amount'),
    });
    console.log('validated:'); console.log(validated);

    if (!validated.success) {
      return {
        errors: validated.error.flatten().fieldErrors,
        message: 'Failed to update balance.',
      };
    }

    const { amount } = validated.data;
    const balance = user.balance + amount;

    const updatedUser = await updateUserById(user.id, { balance });
    await setSession(updatedUser);
  } catch (error) {
    console.log('Database Error:', error);
    return {
      message: 'Database Error: Failed to update balance.',
    };
  }
  
  revalidatePath('/wallet');
  redirect('/wallet');
}