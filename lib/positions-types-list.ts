export const positionsTypesList = [
  { value: "entrée", name: "Entrée" },
  { value: "délivrance postale", name: "Délivrance postale" },
  { value: "bâtiment", name: "Bâtiment" },
  { value: "cage d’escalier", name: "Cage d’escalier" },
  { value: "logement", name: "Logement" },
  { value: "parcelle", name: "Parcelle" },
  { value: "segment", name: "Segment" },
  { value: "service technique", name: "Service technique" },
  { value: "inconnue", name: "Inconnu" },
];

export const getPositionName = (value) => {
  const position = positionsTypesList.find(
    (position) => position.value === value
  );
  return position ? position.name : value;
};
