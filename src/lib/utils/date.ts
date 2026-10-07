import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

// Retourne une phrase complète ("il y a 3 jours") pour les durées de moins
// d'un mois, ou une date courte ("3 janv. 2024") au-delà — au-delà d'un
// mois, une durée relative devient moins lisible qu'une date absolue.
export const getDuration = (start: Date, end: Date = new Date()) => {
  const duration = end.getTime() - start.getTime();

  if (duration > MONTH_IN_MS) {
    return `le ${format(start, "d MMM yyyy", { locale: fr })}`;
  }

  const seconds = Math.floor(duration / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  return `il y a ${seconds} seconde${seconds > 1 ? "s" : ""}`;
};

export const getLongFormattedDate = (date: Date) => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Ex: "mercredi 1er janvier 2023"
export const getFullDate = (date: Date) => {
  return format(date, "PPPP", {
    locale: fr,
  });
};

export const hasBeenSentRecently = (sentAt: Date) => {
  const now = new Date();

  const floodLimitTime = new Date(sentAt);
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5);
  return now < floodLimitTime;
};
