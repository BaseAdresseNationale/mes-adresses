import { useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { SearchItemType } from "@/components/autocomplete";

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
  const fuseRef = useRef<Fuse<SearchItemType<ParcelleFeature>> | null>(null);

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
        const parcelles = features.map((feature: ParcelleFeature) => ({
          id: feature.id,
          label: feature.id,
          geometry: feature.geometry,
        }));

        fuseRef.current = new Fuse(parcelles, {
          keys: ["id"],
          threshold: 0.1,
        });
      } catch (error) {
        console.error("Error fetching parcelles:", error);
      }
    };

    if (codeCommune) {
      fetchParcelles();
    }
  }, [codeCommune]);

  const handleSearchParcelle = async (inputValue: string) => {
    if (!inputValue || !fuseRef.current) {
      return [];
    }

    const fuse = fuseRef.current;
    const results = fuse.search(inputValue, {
      limit: 10,
    });

    return results.map((result) => result.item);
  };

  return {
    handleSearchParcelle,
  };
}
