'use server'

import { Bot } from "grammy";

const bot = new Bot(process.env.TG_BOT_TOKEN!);

export async function createInvoiceLink(label: string, amount: number) { // TODO!
  const invoiceLink = await bot.api.createInvoiceLink(
    'createInvoiceLink title',
    'createInvoiceLink description',
    'createInvoiceLink payload',
    '',
    'XTR',
    [{ label: label, amount: amount }]
  );
  console.log('invoiceLink', invoiceLink);

  return invoiceLink;
}