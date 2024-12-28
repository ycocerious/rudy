interface DateComparisonOptions {
  ignoreTime?: boolean;
}

export function areDatesEqual(
  date1: Date | null | undefined,
  date2: Date | null | undefined,
  options: DateComparisonOptions = {},
): boolean {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;

  if (options.ignoreTime) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  return date1.getTime() === date2.getTime();
}
