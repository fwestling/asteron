// import UserRole from '../data/user-role';

/** Creates a time series from the given start date to the end date */
export const createTimeSeries = (
  start: Date,
  end?: Date,
  intervalDays: number = 1,
): Date[] => {
  const numIntervals = Math.ceil(
    ((end ?? new Date()).getTime() - start.getTime()) /
      (intervalDays * 24 * 60 * 60 * 1000) +
      1,
  );
  const datesArray = Array.from(
    { length: numIntervals },
    (_, i) =>
      new Date(start.getTime() + i * intervalDays * 24 * 60 * 60 * 1000),
  );
  return datesArray;
};

/** Rouunds date to the start of the day */
export const roundDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Rouunds date to the start of the day */
export const isSameDay = (date: Date, compare: Date): boolean =>
  date.getFullYear() === compare.getFullYear() &&
  date.getMonth() === compare.getMonth() &&
  date.getDate() === compare.getDate();

export const isBefore = (date: Date, compare: Date): boolean =>
  date.getTime() <= compare.getTime();

/** Stats for displaying in a time-sequence graph. */
export default class GraphGetDto {
  day: Date;
  value: number;

  constructor(fields: typeof GraphGetDto) {
    Object.assign(this, fields);
  }
}
