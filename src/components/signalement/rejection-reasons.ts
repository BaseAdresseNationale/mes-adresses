export const rejectionReasonsOptions = [
  "Signalement non pertinent",
  "Signalement en double",
  "Signalement déjà traité",
  "Signalement mal positionné",
  "Signalement non conforme",
  "Autre",
] as const;

export type RejectionReasonOption = (typeof rejectionReasonsOptions)[number];
