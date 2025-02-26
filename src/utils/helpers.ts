import { openTelegramLink, openLink } from '@telegram-apps/sdk-react';

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
  if (openTelegramLink.isAvailable()) { // TODO: format link
    openTelegramLink(link);
  } else if (openLink.isAvailable()) {
    openLink(link, {
      tryInstantView: true,
    });
  }
}