"use client";

import React, { useState, useEffect, useMemo } from "react";

import { CadastreService } from "@/lib/cadastre/cadastre";

export type ParcelleType = {
  id: string;
  label: string;
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

interface CadastreContextType {
  communeParcellesIds: string[];
  communeParcelles: ParcelleType[];
}

const CadastreContext = React.createContext<CadastreContextType | null>(null);

interface CadastreContextProviderProps {
  codeCommune: string;
  children: React.ReactNode;
}

export function CadastreContextProvider({
  codeCommune,
  children,
}: CadastreContextProviderProps) {
  const [communeParcellesIds, setcommuneParcellesIds] = useState<
    string[] | null
  >(null);

  const [communeParcelles, setCommuneParcelles] = useState<
    ParcelleType[] | null
  >(null);

  useEffect(() => {
    async function fetchCommuneParcelles() {
      try {
        const featureCollection =
          await CadastreService.findCadastreCommune(codeCommune);
        const parcellesIds = featureCollection.features?.map(
          ({ id }) => id
        ) as string[];
        setcommuneParcellesIds(parcellesIds);

        const parcelles: ParcelleType[] = featureCollection.features?.map(
          (feature) =>
            ({
              id: feature.id,
              label: feature.id,
              geometry: feature.geometry,
            }) as ParcelleType
        );
        setCommuneParcelles(parcelles);
      } catch (e) {
        console.error("ERROR lors fetch du cadastre", e);
        setCommuneParcelles([]);
      }
    }

    fetchCommuneParcelles();
  }, [codeCommune]);

  const value = useMemo(
    () => ({
      communeParcellesIds,
      communeParcelles,
    }),
    [communeParcellesIds, communeParcelles]
  );

  return (
    <CadastreContext.Provider value={value}>
      {children}
    </CadastreContext.Provider>
  );
}

export default CadastreContext;
