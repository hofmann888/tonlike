'use server'

import { tgApiRequest } from "../request";

export async function POST(req: Request) {
  try {
    console.log('post check-boosts');

    const { tgId, channel } = await req.json();
    console.log('tgId:', tgId); console.log('channel:', channel);

    if (!tgId || !channel) {
      throw new Error('Invalid request: missing telegram user ig or channel name.');
    }

    let chat_id = channel;
    if (!channel.startsWith('@') && !channel.startsWith('-100')) {
      chat_id = '@' + channel;
    }

    const params = new URLSearchParams({ chat_id: chat_id, user_id: tgId })
    const data = await tgApiRequest('getUserChatBoosts', params);
    
    const isBoosted = !!data.result.boosts.length;

    return Response.json({ success: true, result: isBoosted });
  } catch (error: any) {
    console.log(error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}