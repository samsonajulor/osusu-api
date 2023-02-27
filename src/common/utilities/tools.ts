export function isDatesEqualDuration(
  startDate: Date,
  endDate: Date,
  duration: Date,
): boolean {
  const diffInMs: number = endDate.getTime() - startDate.getTime();
  const diffDuration: Date = new Date(diffInMs);

  if (
    diffDuration.getUTCDate() - 1 !== duration.getUTCDate() ||
    diffDuration.getUTCHours() !== duration.getUTCHours() ||
    diffDuration.getUTCMinutes() !== duration.getUTCMinutes() ||
    diffDuration.getUTCSeconds() !== duration.getUTCSeconds()
  ) {
    return false;
  }
  return true;
}
