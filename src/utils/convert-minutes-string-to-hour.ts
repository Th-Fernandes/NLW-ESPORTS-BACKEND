export function convertMinutesStringToHour(minutesAmount:number) {
  const hours = Math.floor(minutesAmount / 60);
  const minutes = minutesAmount % 60;

  const formatedMinutes = String(minutes).padStart(2, '0');
  const formatedHours = String(hours).padStart(2, '0');

  return `${formatedHours}:${formatedMinutes}`;
}