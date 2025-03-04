'use server'

import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    const headersList = headers();
    const token = process.env.TG_BOT_SECRET_TOKEN;
    const secret = headersList.get('X-Telegram-Bot-Api-Secret-Token');

    if (!secret || !token || secret !== token) {
      throw new Error('Webhook auth failed.');
    }

    Response.json(null);
  } catch (error: any) {
    console.log('Webhook Error:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}