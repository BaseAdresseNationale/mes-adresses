"use client";

import React, { useState, useEffect, useMemo } from "react";

import { CadastreService } from "@/lib/cadastre/cadastre";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface CadastreContextType {
  communeParcelles: string[];
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
  const [communeParcelles, setCommuneParcelles] = useState<string[]>([]);

  useEffect(() => {
    async function featchCommuneParcelles() {
      const featureCollection =
        await CadastreService.findCadastreCommune(codeCommune);
      const parcelles = featureCollection.features?.map(
        ({ id }) => id
      ) as string[];
      setCommuneParcelles(parcelles);
    }

    featchCommuneParcelles();
  }, [codeCommune]);

  const value = useMemo(
    () => ({
      communeParcelles,
    }),
    [communeParcelles]
  );

  return (
    <CadastreContext.Provider value={value}>
      {children}
    </CadastreContext.Provider>
  );
}

export default CadastreContext;
