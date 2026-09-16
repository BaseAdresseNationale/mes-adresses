export const rejectionReasonsOptions = {
  "Non pertinent": `Merci d'avoir pris le temps de nous signaler ce problème.\nAprès vérification, nous n'allons pas donner suite à ce signalement.`,
  "En double": `Merci d'avoir pris le temps de nous signaler ce problème.\nCette anomalie nous a déjà été remontée, nous allons donc clore ce signalement.`,
  "Déjà traité": `Merci d'avoir pris le temps de nous signaler ce problème.\nCe signalement a déjà été traité, nous allons donc clore ce signalement.`,
  "Mal positionné": `Merci d'avoir pris le temps de nous signaler ce problème.\nL'anomalie signalée est mal positionnée, nous allons donc clore ce signalement.`,
  Autre: ``,
};

export type RejectionReasonOption = keyof typeof rejectionReasonsOptions;
