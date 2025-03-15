"use server";

import type { Locale } from "./types";
import { cookies } from "next/headers";
import { defaultLocale } from "./config";

const COOKIE_NAME = "NEXT_LOCALE";

const getLocale = async () => {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
};

const setLocale = async (locale?: string) => {
  cookies().set(COOKIE_NAME, locale as Locale || defaultLocale);
};

export { getLocale, setLocale };