import {
  useState,
  useCallback,
  useContext,
  useMemo,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { sortBy } from "lodash";
import {
  SelectField,
  SelectMenu,
  Pane,
  Button,
  Text,
  Alert,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import { BasesLocalesService, Numero } from "@/lib/openapi";
import DrawContext from "@/contexts/draw";

interface AddNumerosWithPolygonProps {
  numerosIds: string[];
  setNumerosIds: Dispatch<SetStateAction<string[]>>;
}

function AddNumerosWithPolygon({
  numerosIds,
  setNumerosIds,
}: AddNumerosWithPolygonProps) {
  const { baseLocale } = useContext(BalDataContext);
  const { enableDrawPolygon, disableDrawPolygon, data, setHint, setModeId } =
    useContext(DrawContext);

  useEffect(() => {
    enableDrawPolygon();
    setHint(
      "Cliquez sur la carte pour dessiner un polygon. Une fois terminé, cliquez sur le dernier point afin de fermer le poligon. Les numeros dans le poligone seront selectionné"
    );
    return () => {
      disableDrawPolygon();
    };
  }, [enableDrawPolygon, setHint, disableDrawPolygon]);

  useEffect(() => {
    async function searchNumeros() {
      const numeros: Numero[] = await BasesLocalesService.searchNumeros(
        baseLocale.id,
        {
          polygon: data.geometry.coordinates[0] as unknown as number[][],
        }
      );
      setNumerosIds(numeros.map(({ id }) => id));
    }

    if (data) {
      setModeId("editing");
      searchNumeros();
    }
  }, [baseLocale.id, data, setModeId, setNumerosIds]);

  const selectedNumerosCount = useMemo(() => {
    if (numerosIds.length === 0) {
      return "Aucun numéro n’est sélectionné";
    }

    if (numerosIds.length === 1) {
      return "1 numéro est sélectionné";
    }

    return `${numerosIds.length} numéros sont sélectionnés`;
  }, [numerosIds.length]);

  return (
    <Pane>
      {data === null ? (
        <Alert
          intent="none"
          title="Cliquez sur la carte pour dessiner un polygon. Une fois terminé, cliquez sur le dernier point afin de fermer le poligon. Les numeros dans le poligone seront selectionné"
          marginBottom={32}
        />
      ) : (
        <>
          <Alert
            intent="none"
            title="Modifier le polygone directement depuis la carte pour changer les numeros sélectionés."
            marginBottom={8}
          />
          <Pane
            backgroundColor="white"
            padding={8}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={8}
            borderRadius={8}
          >
            {selectedNumerosCount}
          </Pane>
        </>
      )}
    </Pane>
  );
}

export default AddNumerosWithPolygon;
