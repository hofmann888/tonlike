'use server'

import { calculateFinalPrice, getProductPayload } from "./helpers";
import { Product } from "@/lib/definitions";
import { Bot } from "grammy";

const bot = new Bot(process.env.TG_BOT_TOKEN!);

export async function createInvoiceLinkByProduct(product: Product) {
  const finalPrice = calculateFinalPrice(product.price, product.discount);
  const payload = getProductPayload(product);

  const invoiceLink = await bot.api.createInvoiceLink(
    product.title,
    product.description,
    payload,
    '',
    'XTR',
    [{ label: 'product', amount: finalPrice }]
  );

  return invoiceLink;
}