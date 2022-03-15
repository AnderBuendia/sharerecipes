export enum DATE_UNITS {
  days = 86400,
  hour = 3600,
  minute = 60,
  second = 1,
}

const MILLISECONDS_TO_SECONDS = 1000;

const getDateDiffs = (timestamp: number) => {
  const now = Date.now();
  const elapsed = (timestamp - now) / MILLISECONDS_TO_SECONDS;
  let value: number | undefined;
  let unit: string | undefined;

  for (const [unitDate, secondsInUnit] of Object.entries(DATE_UNITS)) {
    if (Math.abs(elapsed) > secondsInUnit || unitDate === 'second') {
      return {
        value: Math.floor(elapsed / Number(secondsInUnit)),
        unit: unitDate,
      };
    }
  }

  return { value, unit };
};

export function useTimeAgo(timestamp: number) {
  const { value, unit } = getDateDiffs(timestamp);
  const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });

  if (value && unit) {
    return rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
  }
}
