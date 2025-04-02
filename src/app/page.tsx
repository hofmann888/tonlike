'use client'

import { clearHideEarnWaningCookie } from "@/core/server-actions";
import { createInvoiceLink } from "@/utils/tg-api";
import { invoice } from "@telegram-apps/sdk-react";
import { ShowPromiseResult } from "@/lib/adsgram";
import { useAdsgram } from "@/hooks/useAdsgram";
import { deleteSession } from "@/core/session";
import { AppEnvEnum } from "@/lib/definitions";
import { Button } from "@heroui/button";
import { useCallback } from "react";
import { Bot } from "grammy";
import EarnAdQuestCard from "@/components/Earn/EarnAdQuestCard";
import PageLoader from "@/components/Common/PageLoader";

export default function Home() {
  if (process.env.NEXT_PUBLIC_APP_ENV === AppEnvEnum.PROD) return <PageLoader />;

  const test = async () => {
    console.log('test');
    await clearHideEarnWaningCookie();
  }

  const onReward = useCallback(() => {
    console.log('useAdsgram onReward');
  }, []);
  const onError = useCallback((result: ShowPromiseResult) => {
    console.error('useAdsgram onError', JSON.stringify(result, null, 4));
  }, []);
  const showAd = useAdsgram({ onReward, onError });

  const bot = new Bot('8149925335:AAGvGnTriCTaq-xSbKmkhBR8-IOBbQpN6co');

  async function testSendInvoice() {
    const sendInvoice = await bot.api.sendInvoice(
      6681557705, 
      'testSendInvoice title', 
      'testSendInvoice description', 
      'testSendInvoice payload', 
      'XTR',
      [{ label: 'prce label', amount: 88 }]
    );
    console.log('sendInvoice', sendInvoice);
  }

  async function testCreateInvoiceLink() {
    const invoiceLink = await bot.api.createInvoiceLink(
      'createInvoiceLink title',
      'createInvoiceLink description',
      'createInvoiceLink payload',
      '',
      'XTR',
      [{ label: 'price label', amount: 88 }]
    );
    console.log('invoiceLink', invoiceLink);
  }

  async function testOpenInvoice() {
    // const invoice = initInvoice();
    // openInvoice('LkPb269IGUsQFAAAM490CiZgR-U')
    const invoiceLink = await createInvoiceLink('price label', 1);
    console.log('invoiceLink', invoiceLink);
    invoice
      .open(invoiceLink, 'url')
      .then((status: any) => {
        return console.log('openInvoice status:', status);
      })
  }

  return (
    <div className="home-page py-5">
      <Button color="primary" onPress={() => test()} className="m-2">Test</Button>
      <Button color="primary" onPress={() => showAd()} className="m-2">Ad</Button>
      {/* <button id="adBtn" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover m-2">Ad</button> */}
      <Button onPress={() => deleteSession()} className="m-2">Delete session</Button>

      <div>
        <Button onPress={() => testSendInvoice()} className="m-2">sendInvoice</Button>
        <Button onPress={() => testCreateInvoiceLink()} className="m-2">createInvoiceLink</Button>
        <Button onPress={() => testOpenInvoice()} className="m-2">openInvoice</Button>
      </div>

      <EarnAdQuestCard />
    </div>
  );
}
