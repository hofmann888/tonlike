import { LocaleEnum } from "./types";

export const timeZone = 'Europe/Amsterdam';
export const defaultLocale = LocaleEnum.EN;
export const locales = [defaultLocale, LocaleEnum.RU] as const;
export const localesMap = [
  { key: 'en', title: 'English', flag: '🇬🇧' },
  { key: 'ru', title: 'Русский', flag: '🇷🇺' },
];
