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

bot.on('message', (ctx) => {
  console.log('on message ctx', ctx);
  console.log('on msg ctx.message', ctx.message);
});

// bot.handleUpdate()

bot.preCheckoutQuery('some payload', async (ctx) => {
  console.log('preCheckoutQuery ctx', ctx);
  console.log('preCheckoutQuery ctx.preCheckoutQuery', ctx.preCheckoutQuery);
  ctx.answerPreCheckoutQuery(false);
})

export const POST = webhookCallback(bot, 'std/http', { secretToken: process.env.TG_BOT_WEBHOOK_TOKEN });
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';