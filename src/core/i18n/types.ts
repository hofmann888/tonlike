import type { locales } from "./config";

export enum LocaleEnum {
  EN = 'en',
  RU = 'ru',
}
export type Locale = (typeof locales)[number];