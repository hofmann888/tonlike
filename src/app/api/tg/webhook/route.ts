'use server'

import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const headersList = headers();
    const token = process.env.TG_BOT_WEBHOOK_TOKEN;
    const secret = headersList.get('X-Telegram-Bot-Api-Secret-Token');
    console.log('secret:', secret);

    if (!secret || !token || secret !== token) {
      throw new Error('Webhook auth failed.');
    }

    const body = await req.json();
    console.log('body:', body);

    Response.json({"message": "ok"}); // Response.json(null);
  } catch (error: any) {
    console.log('Webhook Error:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}