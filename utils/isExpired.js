export function isExpired(dateString) {
  return new Date(dateString).getTime() <= Date.now();
}
