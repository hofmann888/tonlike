'use server'

import { deleteSession, getSession, setSession } from './session';
import { validate, parse } from '@telegram-apps/init-data-node';
import { createUser, updateUser, fetchUserByTgId } from '@/db/query';
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

    if (['production', 'test'].includes(process.env.NEXT_PUBLIC_APP_ENV as string)) {
      // TODO: coockie expires 24h
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
      user = await createUser({
        tgId: initData.user.id,
        tgUsername: initData.user.username as string, // TODO!: empty username in initData (fadey)
        tgPhotoUrl: initData.user.photoUrl as string, // TODO?: undefined?
      });
    }
    if (user.tgUsername !== initData.user.username || user.tgPhotoUrl !== initData.user.photoUrl) {
      user = await updateUser(user.id, { 
        tgUsername: initData.user.username, 
        tgPhotoUrl: initData.user.photoUrl
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