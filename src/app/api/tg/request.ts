'use server'

export async function tgApiRequest(method: string, params: URLSearchParams) {
  const token = process.env.TG_BOT_TOKEN;
  if (!token) {
    throw new Error('Telegram bot token is missing.');
  }

  const url = `https://api.telegram.org/bot${token}/${method}?${params.toString()}`;

  const response = await fetch(url);
  console.log('Telegram Bot API response:', response);
  if (!response.ok) {
    throw new Error(`Telegram Bot API error: ${response.text()} - ${response.status}`);
  }

  const data = await response.json();
  console.log('Telegram Bot API data:', data);
  if (!data.ok) {
    throw new Error(`Telegram API data error: ${JSON.stringify(data)}`);
  }

  return data;
}