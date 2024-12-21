'use server'

import { SignJWT, jwtVerify } from "jose";
import { cookies } from 'next/headers';
import { createUser, fetchUserByTgId } from "@/db/sql";
import { NextRequest, NextResponse } from "next/server";

// const expiresIn = parseInt(process.env.SESSION_TIME as string); // TODO: env?
const expiresIn = 3600;
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

export async function setSession(tg_id: number) {
  console.log('setSession');
  console.log(expires);

  let user = await fetchUserByTgId(tg_id);
  if (!user) { 
    user = await createUser(tg_id);
  }

  const expDate = new Date(expires);

  cookies().set({ 
    name: 'session',
    value: await encrypt({ user, expDate }),
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
  console.log(session);
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  cookies().delete('session');
}