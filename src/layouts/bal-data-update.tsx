"use client";

import BalDataContext from "@/contexts/bal-data";
import {
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
  Numero,
} from "@/lib/openapi-api-bal";
import { useContext, useEffect, useState } from "react";

interface BALDataUpdateProps {
  children: React.ReactNode;
  voie?: ExtendedVoieDTO;
  toponyme?: ExtentedToponymeDTO;
  numeros?: Numero[];
}

export default function BALDataUpdate({
  children,
  voie,
  toponyme,
  numeros,
}: BALDataUpdateProps) {
  const [updated, setUpdated] = useState(false);
  const { setVoie, setToponyme, setNumeros } = useContext(BalDataContext);

  useEffect(() => {
    if (voie) {
      setVoie(voie);
    }

    if (toponyme) {
      setToponyme(toponyme);
    }

    if (numeros) {
      setNumeros(numeros);
    }

    setUpdated(true);

    return () => {
      setVoie(null);
      setToponyme(null);
      setNumeros([]);
    };
  }, [voie, toponyme, numeros, setVoie, setToponyme, setNumeros]);

  return updated ? children : null;
}
