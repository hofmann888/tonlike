import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';
import { addToast, ToastProps } from "@heroui/toast";

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