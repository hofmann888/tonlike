'use server'

import { headers } from 'next/headers';
import util from 'util';

export async function POST(req: Request) {
  try {
    console.log('post webhook');

    const body = await req.json();
    console.log('webhook body:', util.inspect(body, false, null, true));

    const headersList = headers();

    // TODO: check "X-Telegram-Bot-Api-Secret-Token" header
    const token = headersList.get('X-Telegram-Bot-Api-Secret-Token');
    console.log('secret token:', token);

    Response.json(null);
  } catch (error: any) {
    console.log('webhook error:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}