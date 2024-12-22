'use server'

import { validate, parse } from '@telegram-apps/init-data-node';
import { headers } from 'next/headers';
import { deleteSession, getSession, setSession } from './session';
import { createUser, fetchUserByTgId } from '@/db/sql';

export async function POST() {
  console.log('post auth');
  try {
    const headersList = headers();
    const authData = headersList.get('Authorization');
    const token = process.env.TWA_API_TOKEN;
    let session: any = null;
    
    if (authData && token) {
      if (!process.env.APP_DEBUG) { // TODO: NODE_ENV === 'production'?
        validate(authData, token, {
          expiresIn: 3600, // TODO: coockie expires && validate expiresIn?
        });
      }

      const initData = parse(authData);
      console.log('post auth parsed initData:'); console.log(initData);

      const tgId = initData?.user?.id;
      if (!tgId) {
        throw Error('Undefined tg user ID!')
      }
      let user = await fetchUserByTgId(tgId);
      if (!user) { 
        user = await createUser(tgId);
      }
      await setSession(user);
      session = await getSession();
    }

    return Response.json({ success: true, session: session });
  } catch (error) {
    // redirect on 403 if auth failed?
    await deleteSession();
    return Response.json({ success: false, error }, { status: 500 });

    // TODO:
    // if (error.type === 'CredentialsSignin') { // 'ERR_EXPIRED' | ...
    //   res.status(401).json({ error: 'Invalid credentials.' })
    // } else {
    //   res.status(500).json({ error: 'Something went wrong.' })
    // }
  }
}