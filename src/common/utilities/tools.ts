export function isDatesEqualDuration(
  startDate: Date,
  endDate: Date,
  durationInMonths: number,
): boolean {
  const diffMonths: number =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (diffMonths !== durationInMonths) return false;

  return true;
}

export function isStartDateBeforeEndDate(
  startDate: Date,
  endDate: Date,
): boolean {
  return startDate.getTime() <= endDate.getTime();
}
