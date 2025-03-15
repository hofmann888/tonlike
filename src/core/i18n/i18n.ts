import type { Locale } from "./types";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";
import { getLocale } from "./locale";

const i18nRequestConfig = getRequestConfig(async () => {
  const locale = await getLocale() as Locale;

  return {
    locale,
    messages:
      locale === defaultLocale || !locales.includes(locale)
        ? (await import(`@/core/i18n/locales/${defaultLocale}.json`)).default
        : (await import(`@/core/i18n/locales/${locale}.json`)).default,
  };
});

export default i18nRequestConfig;
