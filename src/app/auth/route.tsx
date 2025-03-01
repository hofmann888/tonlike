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
      const expiresIn = parseInt(process.env.SESSION_TIME as string);
      validate(authData, token, {
        expiresIn: expiresIn, // TODO?: coockie expires && validate expiresIn?
      });
    }

    const initData = parse(authData);
    console.log('post auth parsed initData:', initData);
    if (!initData?.user?.id) {
      throw Error('Undefined tg user!');
    }
    const tgUsername = initData.user.username ?? null;
    const tgPhotoUrl = initData.user.photoUrl ?? null;

    let user = await fetchUserByTgId(initData.user.id);
    if (!user) { 
      let reffererId = null;
      if (initData.startParam?.length && initData.startParam !== 'debug') {
        const referrer = await fetchUserByTgId(initData.startParam as any as number); // TODO!: if startParam not number -> inifinite auth request loop
        if (referrer?.id) {
          reffererId = referrer.id;
        }
      }

      user = await createUser({
        tgId: initData.user.id,
        tgUsername: tgUsername,
        tgPhotoUrl: tgPhotoUrl,
        referrerId: reffererId,
        balance: 1000,
      });
    }
    if (user.tgUsername !== tgUsername || user.tgPhotoUrl !== tgPhotoUrl) {
      user = await updateUser(user.id, { 
        tgUsername: tgUsername, 
        tgPhotoUrl: tgPhotoUrl,
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