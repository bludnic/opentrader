import { millisecondsToMinutes, minutesToMilliseconds } from 'date-fns';

export function daysAgoToTimestamp(daysAgo: number) {
  const millisecondsAgo = daysAgo * 24 * 3600 * 1000;

  const currentTimestampMilliseconds = new Date().getTime();
  const currentTimestampMinutes = millisecondsToMinutes(
    currentTimestampMilliseconds,
  );
  // rounded to minutes
  const currentTimestamp = minutesToMilliseconds(currentTimestampMinutes);

  return currentTimestamp - millisecondsAgo;
}
