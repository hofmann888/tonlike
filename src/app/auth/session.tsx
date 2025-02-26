'use server'

import { NextRequest, NextResponse } from "next/server";
import { fetchUserById } from "@/db/query";
import { SignJWT, jwtVerify } from "jose";
import { User } from "@/lib/definitions";
import { cookies } from 'next/headers';

const expiresIn = parseInt(process.env.SESSION_TIME as string);
const expires = Date.now() + expiresIn * 1000;
const secretKey = process.env.SESSION_SECRET_KEY;
const jwtKey = new TextEncoder().encode(secretKey);


export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(jwtKey);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, jwtKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function setSession(user: User) {
  console.log('setSession');
  console.log(expires);

  cookies().set({ 
    name: 'session',
    value: await encrypt({ user, expDate: new Date(expires) }),
    expires: expires,
    httpOnly: true,
    secure: true,
    sameSite: 'none', // TODO: 'lax'? telegram web use frame to open TWA
  });
}

export async function updateSession(request: NextRequest) {
  console.log('updateSession');

  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expDate = new Date(expires);
  
  const response = NextResponse.next();
  response.cookies.set({
    name: 'session', 
    value: await encrypt(parsed),
    expires: expires,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return response;
}

export async function getSession() {
  console.log('getSession');
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  cookies().delete('session');
}

export async function getAuthUser(safe: boolean = true, db: boolean = true) {
  console.log('getAuthUser');
  const session = await getSession();
  let user = session?.user;
  if (!user?.id && !safe) {
    throw new Error('Not authorized.');
  }
  // if (db) { // TODO: remove after fixing transactions with balance? or set only id in coockie?
  //   user = await fetchUserById(user.id);
  // }
  return user as User; // TODO: validate user from session? // decompose object?
}
