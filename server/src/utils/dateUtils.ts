/**
 * Date and Time utilities for SBT CINEMAS (Asia/Kolkata / IST)
 */

export const TIMEZONE = 'Asia/Kolkata';

/**
 * Returns current Date in Asia/Kolkata timezone
 */
export function getNowIST(): Date {
  return new Date();
}

/**
 * Returns YYYY-MM-DD string for a given date in IST
 */
export function formatISTDate(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // returns 'YYYY-MM-DD'
}

/**
 * Returns array of date objects starting from today in IST
 */
export function getUpcomingDates(daysCount = 7, startDate: Date = new Date()): Array<{
  dateString: string; // YYYY-MM-DD
  dayName: string;    // 'TODAY', 'THU', 'FRI', etc.
  dayNumber: string;  // '07', '08'
  monthName: string;  // 'OCT'
  fullLabel: string;  // 'TODAY — 07 OCT'
  isToday: boolean;
}> {
  const results = [];
  const todayStr = formatISTDate(startDate);

  for (let i = 0; i < daysCount; i++) {
    const target = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateString = formatISTDate(target);
    const isToday = i === 0;

    const weekdayShort = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      weekday: 'short',
    }).format(target).toUpperCase();

    const dayNumber = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      day: '2-digit',
    }).format(target);

    const monthName = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      month: 'short',
    }).format(target).toUpperCase();

    const dayName = isToday ? 'TODAY' : weekdayShort;
    const fullLabel = `${dayName} — ${dayNumber} ${monthName}`;

    results.push({
      dateString,
      dayName,
      dayNumber,
      monthName,
      fullLabel,
      isToday,
    });
  }

  return results;
}
