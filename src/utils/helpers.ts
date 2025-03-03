import { addToast, ToastProps } from "@heroui/toast";
import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';
import { ServiceName, ServiceNameEnum } from '@/lib/definitions';
import { serviceLinksMap } from '@/lib/const';

export function checkDailyDone(date: Date) {
  if (!date) { // TODO?: throw error?
    return false;
  }

  date = new Date(date);
  const nowDate = new Date();

  const timeDiff = nowDate.getTime() - date.getTime();
  const timeDiffDays = Math.floor(timeDiff / 86400000);

  return !timeDiffDays;
}

export function tgOpenLink(link: string) {
  try {
    if (link.startsWith('https://t.me/') && openTelegramLink.isAvailable()) {
      openTelegramLink(link);
    } else if (openLink.isAvailable()) {
      openLink(link, {
        tryInstantView: true,
      });
    }
    return true;
  } catch (error) {
    console.error(error);
    const toast = {
      color: "danger",
      title: "Something went wrong.",
      description: "Try again.",
    };
    addToast(toast as ToastProps);
    return false;
  }
}

// TODO?: return false | error on missing substring?
export function formatLink(str: string, serviceName: ServiceName, format: 'link' | 'name') {
  let strPrepared = str;
  let search = '@';

  if (format === 'name') {
    search = '';
    strPrepared = str.replace(/^https?:\/\/(www\.)?/, 'https://');
    const searchArray = serviceLinksMap[serviceName as keyof typeof serviceLinksMap];
    if (!searchArray) {
      return str;
    }
    searchArray.some((item) => {
      if (strPrepared.startsWith(item)) {
        search = item;
        return true;
      }
    })
    if ([ServiceNameEnum.TIKTOK, ServiceNameEnum.YOUTUBE].includes(serviceName)) {
      search += '@';
    }
  }

  if (!search.length || !strPrepared.startsWith(search)) {
    return str;
  }

  let replace = '@';
  if (format === 'link') {
    const replaceArray = serviceLinksMap[serviceName as keyof typeof serviceLinksMap];
    if (!replaceArray?.length) {
      return str;
    }
    replace = replaceArray[0];
    if ([ServiceNameEnum.TIKTOK, ServiceNameEnum.YOUTUBE].includes(serviceName)) {
      replace += '@';
    }
  }

  if (replace) {
    str = strPrepared.replace(search, replace);
    if (format === 'name') {
      str = str.replace(/\?.+$/, '');
      str = str.replace(/\/$/, '');
    }
    if (format === 'link') {
      str += '/';
    }
  }

  return str;
}

export function getEnvBoolean(value?: string) {
  return (value?.length && ['true', '1'].includes(value.toLowerCase())) as boolean;
}