import { tgOpenLink } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Button } from "@heroui/button";
import Image from 'next/image';

export default function AirdropBanner() {
  const t = useTranslations('components.WalletBanner');

  const link = 'https://t.me/tonlike_app';

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-center text-4xl font-black text-primary uppercase">{t('soon')}</p>
        <p className="text-center text-large font-bold mt-3 uppercase">{t('stayTuned')}</p>
      </div>

      <div className="sticky bottom-28 w-full text-center">
        <Button 
          size="lg"
          variant="light" 
          aria-label="Telegram"
          startContent={<Image width={30} height={30} src="/img/social/telegram.png" alt="telegram" />}
          onPress={() => tgOpenLink(link)}
        >
          {t('subscribe')}
        </Button>
      </div>
    </>
  )
}