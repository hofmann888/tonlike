import { createPayment, fetchProductById, fetchUserByTgId, updateUser } from "@/db/query";
import { calculateFinalPrice, getProductPayloadList } from "@/utils/helpers";
import { ProductTypeEnum } from "@/lib/definitions";
import { Bot, webhookCallback } from "grammy";

const bot = new Bot(process.env.TG_BOT_TOKEN!);

bot.command("start", (ctx) => {
  console.log('start ctx', ctx);
  ctx.replyWithPhoto("https://tonlike.vercel.app/img/logo.png", {
    caption: `TonLike is a mini app in Telegram for promoting social media. 🤝\n\nYou can both promote your social media by creating your own tasks and earn money by completing tasks of other users. 💰`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Start earning💵',
            url: `https://t.me/${process.env.NEXT_PUBLIC_TG_BOT_NAME}/${process.env.NEXT_PUBLIC_TG_APP_NAME}`,
          },
          {
            text: 'Stay tuned🔔',
            url: 'https://t.me/tonlike_app'
          },
        ]
      ]
    }
  });
});

bot.on('message', async (ctx) => {
  console.log('on message ctx', ctx);
  console.log('on msg ctx.message', ctx.message);

  const payment = ctx.message.successful_payment;

  if (payment) {
    const [user, product] = await Promise.all([
      fetchUserByTgId(ctx.message.from.id),
      fetchProductById(payment.invoice_payload as any as number)
    ]);

    if (user && product && product.active && calculateFinalPrice(product.price, product.discount) === payment.total_amount && payment.currency === 'XTR') { // TODO: product currency check
      if (product.type === ProductTypeEnum.COIN) {
        await createPayment({ 
          userId: user.id, 
          productId: product.id, 
          tgChargeId: payment.telegram_payment_charge_id,
          providerChargeId: payment.provider_payment_charge_id,
          price: payment.total_amount
        });
        await updateUser(user.id, { balance: user.balance + product.amount });
      }
    }
  }
});

const trigger = await getProductPayloadList();

bot.preCheckoutQuery(trigger, async (ctx) => {
  console.log('preCheckoutQuery ctx', ctx);
  console.log('preCheckoutQuery ctx.preCheckoutQuery', ctx.preCheckoutQuery);

  const query = ctx.preCheckoutQuery;

  const [user, product] = await Promise.all([
    fetchUserByTgId(query.from.id),
    fetchProductById(query.invoice_payload as any as number)
  ]);

  let ok = false;
  if (user && product && product.active && calculateFinalPrice(product.price, product.discount) === query.total_amount && query.currency === 'XTR') { // TODO: product currency check
    ok = true;
  }

  ctx.answerPreCheckoutQuery(ok);
});

export const POST = webhookCallback(bot, 'std/http', { secretToken: process.env.TG_BOT_WEBHOOK_TOKEN });
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';