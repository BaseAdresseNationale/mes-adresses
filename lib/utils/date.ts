export const getDuration = (start: Date, end: Date = new Date()) => {
  const duration = end.getTime() - start.getTime();
  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} jour${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `${hours} heure${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  return `${seconds} seconde${seconds > 1 ? "s" : ""}`;
};