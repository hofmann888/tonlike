'use server'

import { deleteSession, getSession, setSession } from './session';
import { validate, parse } from '@telegram-apps/init-data-node';
import { createUserByTg, fetchUserByTgId, updateUserById } from '@/db/sql';
import { headers } from 'next/headers';

export async function POST() {
  console.log('post auth');
  try {
    const headersList = headers();
    const authData = headersList.get('Authorization');
    const token = process.env.TG_BOT_TOKEN;
    let session: any = null;
    
    if (!authData || !token) {
      throw Error('Bad request: missing authData or token');
    }

    if (['producntion', 'test'].includes(process.env.NODE_ENV)) {
      validate(authData, token, {
        expiresIn: 3600, // TODO: coockie expires && validate expiresIn?
      });
    }

    const initData = parse(authData);
    console.log('post auth parsed initData:', initData);

    if (!initData?.user?.id) {
      throw Error('Undefined tg user!');
    }
    let user = await fetchUserByTgId(initData.user.id);
    if (!user) { 
      user = await createUserByTg(initData.user);
    }
    if (user.tg_username !== initData.user.username || user.tg_photo_url !== initData.user.photoUrl) {
      user = await updateUserById(user.id, { 
        tg_username: initData.user.username, 
        tg_photo_url: initData.user.photoUrl
      });
    }
    await setSession(user);
    session = await getSession();

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