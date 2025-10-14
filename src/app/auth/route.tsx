'use server'

import { createUser, updateUser, fetchUserByTgId } from '@/db/query';
import { deleteSession, getSession, setSession } from '@/core/session';
import { validate, parse } from '@telegram-apps/init-data-node';
import { AppEnv, AppEnvEnum } from '@/lib/definitions';
import { getEnvBoolean } from '@/utils/helpers';
import { headers } from 'next/headers';

export async function POST() {
  try {
    const headersList = headers();
    const authData = headersList.get('Authorization');
    const token = process.env.TG_BOT_TOKEN;
    let session: any = null;
    
    if (!authData || !token) {
      throw Error('Missing auth data or token.');
    }

    const appEnv = process.env.NEXT_PUBLIC_APP_ENV as AppEnv;
    if (!getEnvBoolean(process.env.NEXT_PUBLIC_TG_MOCK)) {
      const expiresIn = parseInt(process.env.SESSION_TIME as string);
      validate(authData, token, {
        expiresIn: expiresIn, // TODO?: coockie expires && validate expiresIn?
      });
    }

    const initData = parse(authData); 
    console.log('Telegram initData:', initData);
    if (!initData?.user?.id) {
      throw Error('Undefined Telegram user.');
    }
    if (appEnv === AppEnvEnum.STAGE && ![5229340312, 6681557705, 6425951136].includes(initData?.user?.id)) {
      throw Error('Forbidden.');
    }

    const tgUsername = initData.user.username ?? null;
    const tgPhotoUrl = initData.user.photoUrl ?? null;

    let user = await fetchUserByTgId(initData.user.id);
    if (!user) { 
      let reffererId = null;
      const startParam = initData?.startParam;
      if (startParam?.length && startParam.match(/^\d+$/)) {
        const referrer = await fetchUserByTgId(startParam as any as number);
        if (referrer?.id) {
          reffererId = referrer.id;
        }
      }

      user = await createUser({
        tgId: initData.user.id,
        tgUsername: tgUsername,
        tgPhotoUrl: tgPhotoUrl,
        referrerId: reffererId,
        balance: 1000, // TODO: env
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
    console.log('Auth Error:', error);
    await deleteSession();

    let status = 500;
    if (error?.type === 'ERR_EXPIRED') { // TODO: 'ERR_EXPIRED' | ...
      status = 401; // Invalid credentials
    }
    // TODO?: redirect on 403 if auth failed?
    return Response.json({ success: false, error }, { status: status });
  }
}