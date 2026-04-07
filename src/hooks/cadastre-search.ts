import { useContext, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { SearchItemType } from "@/components/autocomplete";
import CadastreContext, { ParcelleType } from "@/contexts/cadastre";

export type ParcelleFeature = Omit<ParcelleType, "label">;

export function useCadastreSearch() {
  const { communeParcelles } = useContext(CadastreContext);
  const fuseRef = useRef<Fuse<SearchItemType<ParcelleType>> | null>(null);

  useEffect(() => {
    if (communeParcelles !== null) {
      fuseRef.current = new Fuse(communeParcelles, {
        keys: ["id"],
        threshold: 0.1,
      });
    }
  }, [communeParcelles]);

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
