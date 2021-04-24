function convertDurationToTimeString(duration: number): string {
  const hoursInSecond = 60 * 60;

  const hours = Math.floor(duration / hoursInSecond);
  const minutes = Math.floor((duration % hoursInSecond) / 60);
  const seconds = duration % 60;

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');

  return timeString;
}

export { convertDurationToTimeString };
