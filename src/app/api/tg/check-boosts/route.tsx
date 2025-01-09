'use server'

export async function POST(req: Request) {
  try {
    console.log('post check-membership');
    const token = process.env.TWA_API_TOKEN;
    if (!token) {
      throw new Error('Telegram bot token is missing.');
    }

    const { tgId, channel } = await req.json();
    console.log('tgId:', tgId);
    console.log('channel:', channel);

    if (!tgId || !channel) {
      throw new Error('Invalid request: missing telegram user ig or channel name.');
    }

    let chat_id = channel;
    if (!channel.startsWith('@') && !channel.startsWith('-100')) {
      chat_id = '@' + channel;
    }

    const url = `https://api.telegram.org/bot${token}/getUserChatBoosts?chat_id=${encodeURIComponent(chat_id)}&user_id=${tgId}`;

    const response = await fetch(url);
    console.log('response:', response);
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.text()} - ${response.status}`);
    }

    const data = await response.json();
    console.log('data:', data);
    if (!data.ok) {
      throw new Error(`Telegram API data error: ${JSON.stringify(data)}`);
    }

    const isBoosted = !!data.result.boosts.length;
    return Response.json({ success: true, result: isBoosted });
  } catch (error: any) {
    console.log(error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}