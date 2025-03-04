'use server'

import 'server-only';

import { ServiceNameEnum } from "@/lib/definitions";
import { formatLink } from "@/utils/helpers";

async function tgApiRequest(method: string, params: URLSearchParams) { // TODO?: try catch?
  const token = process.env.TG_BOT_TOKEN;
  if (!token) {
    throw new Error('Telegram bot token is missing.');
  }

  const url = `https://api.telegram.org/bot${token}/${method}?${params.toString()}`;

  const response = await fetch(url); // TODO: 400 (Bad Request) if user not in group
  console.log('Telegram Bot API response:', response);
  // TODO?: check by response code (e.g. 403 - bot not admin)
  if (!response.ok) {
    throw new Error(`Telegram Bot API Error: ${response.text()} - ${response.status}`);
  }

  const data = await response.json();
  console.log('Telegram Bot API data:', data);
  if (!data.ok) {
    throw new Error(`Telegram API data Error: ${JSON.stringify(data)}`);
  }

  return data;
}

export async function tgCheckMembershipRequest(tgId: number, channel: string) { // channel - bot must be admin; group - can check
  if (!tgId || !channel) { // TODO?: move to common function
    throw new Error('Invalid request data.');
  }

  let chatId = channel;
  if (!channel.startsWith('@') && !channel.startsWith('-100')) {
    chatId = formatLink(channel, ServiceNameEnum.TELEGRAM, 'name');
  }

  const params = new URLSearchParams({ chat_id: chatId, user_id: `${tgId}` });
  try {
    const data = await tgApiRequest('getChatMember', params);
    const isMember = !!data.result.status?.length && ['creator', 'administrator', 'member'].includes(data.result.status);
    
    return { success: data.ok, result: isMember };
  } catch (error) {
    console.log('Telegram Request Error:', error);
    return { success: false };
  }
}

export async function tgCheckBoostRequest(tgId: number, channel: string) {
  if (!tgId || !channel) { // TODO?: move to common function
    throw new Error('Invalid request data.');
  }

  let chatId = channel;
  if (!channel.startsWith('@') && !channel.startsWith('-100')) {
    chatId = formatLink(channel, ServiceNameEnum.TELEGRAM, 'name');
  }

  const params = new URLSearchParams({ chat_id: chatId, user_id: `${tgId}` });
  try {
    const data = await tgApiRequest('getUserChatBoosts', params);
    const isBoosted = !!data.result.boosts.length;
    
    return { success: data.ok, result: isBoosted };
  } catch (error) {
    console.log('Telegram Request Error:', error);
    return { success: false };
  }
}