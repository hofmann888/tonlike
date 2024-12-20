'use server'

import { validate, parse } from '@telegram-apps/init-data-node';
import { headers } from 'next/headers';
import { deleteSession, getSession, setSession } from './session';

export async function POST() {
  console.log('post auth');
  try {
    const headersList = headers();
    const authData = headersList.get('Authorization');
    const token = process.env.TWA_API_TOKEN;
    let session: any = null;
    
    if (authData && token) {
      if (!process.env.APP_DEBUG) { // TODO: APP_ENV === 'prod'?
        validate(authData, token, {
          expiresIn: 3600, // TODO: coockie expires && validate expiresIn?
        });
      }

      const initData = parse(authData);
      console.log('post auth parsed initData:'); console.log(initData);

      if (!initData?.user?.id) {
        throw Error('Undefined tg user ID!')
      }
      await setSession(initData.user.id);
      session = await getSession();
    }

    return Response.json({ success: true, session: session });
  } catch (error) {
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