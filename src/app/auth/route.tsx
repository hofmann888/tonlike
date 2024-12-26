'use server'

import { deleteSession, getSession, setSession } from './session';
import { validate, parse } from '@telegram-apps/init-data-node';
import { createUser, fetchUserByTgId } from '@/db/sql';
import { headers } from 'next/headers';

export async function POST() {
  console.log('post auth');
  try {
    const headersList = headers();
    const authData = headersList.get('Authorization');
    const token = process.env.TWA_API_TOKEN;
    let session: any = null;
    
    if (authData && token) {
      if (process.env.NODE_ENV === 'production') {
        validate(authData, token, {
          expiresIn: 3600, // TODO: coockie expires && validate expiresIn?
        });
      }

      const initData = parse(authData);
      console.log('post auth parsed initData:', initData);

      const tgId = initData?.user?.id;
      if (!tgId) {
        throw Error('Undefined tg user ID!');
      }
      let user = await fetchUserByTgId(tgId);
      if (!user) { 
        user = await createUser(tgId);
      }
      await setSession(user);
      session = await getSession();
    }

    return Response.json({ success: true, session: session });
  } catch (error: any) {
    // TODO: redirect on 403 if auth failed?
    console.log(error);
    await deleteSession();

    let status = 500;
    if (error?.type === 'ERR_EXPIRED') { // TODO: 'ERR_EXPIRED' | ...
      status = 401; // Invalid credentials
    }
    return Response.json({ success: false, error }, { status: status });
  }
}