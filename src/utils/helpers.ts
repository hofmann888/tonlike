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