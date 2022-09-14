export function convertHourStringToMinutes(string:string) {
  const [hours, minutes] = string.split(':').map(Number);

  const hourToMinutes = hours * 60;

  return hourToMinutes + minutes
}