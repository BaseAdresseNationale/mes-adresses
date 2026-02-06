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

const API_CADASTRE_URL =
  process.env.NEXT_PUBLIC_API_CADASTRE ||
  "https://cadastre.data.gouv.fr/bundler/cadastre-etalab";

export function useCadastreSearch(codeCommune: string) {
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
          `${API_CADASTRE_URL}/communes/${codeCommune}/geojson/parcelles`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch parcelles");
        }
        const data = await response.json();
        const features = Array.isArray(data.features) ? data.features : [];
        setParcelles(
          features.map((feature: ParcelleFeature) => ({
            id: feature.id,
            geometry: feature.geometry,
          }))
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
