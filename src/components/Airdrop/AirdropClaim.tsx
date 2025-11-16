'use client'

import { FaParachuteBox } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { tgOpenLink } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Button } from "@heroui/button";
import Image from 'next/image';

export default function AirdropClaim() {
  const t = useTranslations('components.AirdropClaim');

  const airdropLink = 'https://tonkeeper.github.io/airdrop-reference-dapp/?airdropId=c91d7974-695c-4bf6-b04c-da111a12dfaf&testnet=false';
  const supportLink = `https://t.me/${process.env.NEXT_PUBLIC_TG_SUPPORT_BOT_NAME}`;
  const subscribeLink = 'https://t.me/tonlike_app';

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col justify-center items-center">
          <p className="text-center text-4xl font-black mb-3 uppercase">{t('airdrop')}</p>

          <Button 
            size="lg"
            variant="shadow" 
            color="primary"
            aria-label={t('claim')}
            startContent={<FaParachuteBox />}
            onPress={() => tgOpenLink(airdropLink)}
          >
            {t('claim')}
          </Button>
        </div>

        <div className="flex flex-col justify-center items-center mt-12">
          <p className="text-center text-medium mb-3 text-primary-500 px-12">{t('supportMessage')}</p>

          <Button 
            size="lg"
            variant="faded" 
            aria-label={t('support')}
            startContent={<BiSupport />}
            onPress={() => tgOpenLink(supportLink)}
          >
            {t('support')}
          </Button>
        </div>
      </div>

      <div className="sticky bottom-16 w-full text-center">
        <Button 
          size="lg"
          variant="light" 
          aria-label={t('subscribe')}
          startContent={<Image width={30} height={30} src="/img/social/telegram.png" alt="telegram" />}
          onPress={() => tgOpenLink(subscribeLink)}
        >
          {t('subscribe')}
        </Button>
      </div>
    </>
  )
}