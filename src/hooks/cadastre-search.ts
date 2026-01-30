import { useEffect, useState } from "react";
import useFuse from "./fuse";

const fuseOptions = {
  keys: ["id"],
};

export type ParcelleFeature = {
  id: string;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

export function useCadastreSearch(codeCommune: string) {
  if (!process.env.NEXT_PUBLIC_API_CADASTRE) {
    throw new Error("API Cadastre URL is not defined");
  }

  const [parcelles, setParcelles] = useState<ParcelleFeature[]>([]);
  const [filteredParcelles, setFilteredParcelles] = useFuse(
    parcelles,
    200,
    fuseOptions
  );

  useEffect(() => {
    const fetchParcelles = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_CADASTRE}/communes/${codeCommune}/geojson/parcelles`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parcelles");
        }
        const data = await response.json();
        setParcelles(
          data.features.map((feature: ParcelleFeature) => ({
            id: feature.id,
            geometry: feature.geometry,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching parcelles:", error);
        setParcelles([]);
      }
    };

    if (codeCommune) {
      fetchParcelles();
    } else {
      setParcelles([]);
    }
  }, [codeCommune]);

  return {
    filteredParcelles,
    setFilteredParcelles,
  };
}
