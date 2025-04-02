'use client';

import { localesMap } from '@/core/i18n/config';
import { setLocale } from '@/core/i18n/locale';
import { useTranslations } from 'next-intl';
import { Locale } from '@/core/i18n/types';
import { useLocale } from 'next-intl';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('components.LocaleSwitcher');

  return (
    <>
      <select
        name="lang"
        className="w-[48px] h-7 mr-2 z-10 text-center text-xl outline-none py-0.5 rounded-md group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
        defaultValue={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
      >
        {localesMap.map((localeItem) => (
          <option key={localeItem.key} value={localeItem.key}>{localeItem.flag}</option>
        ))}
      </select>

      <span className="text-medium">
        {t('language')}: <span className="capitalize text-primary">{t('title')}</span>
      </span>
    </>
  )
};
