export const trimNomAlt = (nomAlt) => {
  return Object.entries(nomAlt).reduce(
    (acc, [key, value]) => {
      acc[key] = (value as string).trim();
      return acc;
    },
    {} as Record<string, any>
  );
};
