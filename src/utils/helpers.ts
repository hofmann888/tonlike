import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';
import { addToast, ToastProps } from "@heroui/toast";
import { ServiceName, ServiceNameEnum } from '@/lib/definitions';

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
    if (openTelegramLink.isAvailable()) { // TODO: format link
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
// TODO!: add link aliases (eg. https://x.com/ - https://twitter.com/)
export function formatLink(str: string, serviceName: ServiceName, format: 'link' | 'name') {
  let search = format === 'link' ? '@' : serviceLinksMap[serviceName as keyof typeof serviceLinksMap];
  if ([ServiceNameEnum.TIKTOK, ServiceNameEnum.YOUTUBE].includes(serviceName) && format === 'name') {
    search += '@';
  }
  console.log('search', search);
  if (!search) {
    return str;
  }

  str = str.replace(/^https?:\/\/(www\.)?/, 'https://');
  console.log('str', str);
  if (!str.startsWith(search)) {
    return str;
  }

  let replace = format !== 'link' ? '@' : serviceLinksMap[serviceName as keyof typeof serviceLinksMap];
  if ([ServiceNameEnum.TIKTOK, ServiceNameEnum.YOUTUBE].includes(serviceName) && format === 'link') {
    replace += '@';
  }
  console.log('replace', replace);

  if (replace) {
    str = str.replace(search, replace);
    if (format === 'name') {
      str = str.replace(/\?.+$/, ''); // removing search params
      str = str.replace(/\/$/, '');
    }
    if (format === 'link') {
      str += '/';
    }
  }

  return str;
}

export const serviceLinksMap = {
  [ServiceNameEnum.TELEGRAM]: 'https://t.me/', // https://telegram.org/
  [ServiceNameEnum.X]: 'https://x.com/', // https://twitter.com/
  [ServiceNameEnum.INSTAGRAM]: 'https://instagram.com/',
  [ServiceNameEnum.TIKTOK]: 'https://tiktok.com/', // https://www.tiktok.com/@username/
  [ServiceNameEnum.YOUTUBE]: 'https://youtube.com/', // https://www.youtube.com/channel/UCdp-kaIi7YO2WmNQ-LafmpA = https://www.youtube.com/@wearearchitects
  [ServiceNameEnum.VK]: 'https://vk.com/',
  [ServiceNameEnum.FARCASTER]: 'https://farcaster.xyz/',
}