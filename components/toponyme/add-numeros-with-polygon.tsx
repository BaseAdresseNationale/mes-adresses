import {
  useState,
  useContext,
  useMemo,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { SelectMenu, Pane, Button, Text, Alert } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import { BasesLocalesService, Numero } from "@/lib/openapi-api-bal";
import DrawContext, { DrawMode } from "@/contexts/draw";

interface AddNumerosWithPolygonProps {
  numerosIds: string[];
  setNumerosIds: Dispatch<SetStateAction<string[]>>;
}

function AddNumerosWithPolygon({
  numerosIds,
  setNumerosIds,
}: AddNumerosWithPolygonProps) {
  const [numerosSelected, setNumerosSelected] = useState<Numero[]>([]);
  const { baseLocale } = useContext(BalDataContext);
  const { data, setHint, setDrawMode } = useContext(DrawContext);

  useEffect(() => {
    setDrawMode(DrawMode.DRAW_NUMEROS_TO_TOPONYME_POLYGONE);
    setHint(
      "Cliquez sur la carte pour dessiner un polygon. Une fois terminé, cliquez sur le dernier point afin de fermer le polygone. Les numeros dans le polygone seront selectionnés"
    );
    return () => {
      setDrawMode(null);
    };
  }, [setHint, setDrawMode]);

  useEffect(() => {
    async function searchNumeros() {
      const numeros: Numero[] =
        await BasesLocalesService.searchNumerosInPolygon(baseLocale.id, {
          polygon: data.geometry.coordinates[0] as unknown as number[][],
        });
      setNumerosSelected(numeros);
      setNumerosIds(numeros.map(({ id }) => id));
    }

    if (data) {
      searchNumeros();
    }
  }, [baseLocale.id, data, setNumerosIds, setNumerosSelected]);

  const selectedNumerosCount = useMemo(() => {
    if (numerosSelected.length === 0) {
      return "Aucun numéro n’est sélectionné";
    }

    if (numerosSelected.length === 1) {
      return "1 numéro est sélectionné";
    }

    return `${numerosSelected.length} numéros sont sélectionnés`;
  }, [numerosSelected.length]);

  const numeroOptions = useMemo(() => {
    return numerosSelected.map(({ id, numero, suffixe }) => ({
      label: `${numero}${suffixe ? suffixe : ""}`,
      value: id,
    }));
  }, [numerosSelected]);

  const handleSelectNumero = ({ value }) => {
    setNumerosIds((selectedNumeros) => {
      return selectedNumeros.includes(value)
        ? selectedNumeros.filter((id) => id !== value)
        : [...selectedNumeros, value];
    });
  };

  return (
    <Pane>
      {data === null ? (
        <Alert
          intent="none"
          title="Cliquez sur la carte pour dessiner un polygon. Une fois terminé, cliquez sur le dernier point afin de fermer le polygone. Les numeros dans le polygone seront selectionnés"
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
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            marginY={8}
          >
            <SelectMenu
              isMultiSelect
              hasFilter={false}
              title="Sélection des numéros"
              options={numeroOptions}
              selected={numerosIds}
              emptyView={
                <Pane
                  height="100%"
                  paddingX="1em"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Text size={300}>
                    Aucun numéro n’est disponible pour cette voie
                  </Text>
                </Pane>
              }
              onSelect={handleSelectNumero}
              onDeselect={handleSelectNumero}
            >
              <Button marginTop={0} type="button">
                Sélectionner les numéros
              </Button>
            </SelectMenu>

            {numerosSelected.length > 0 && (
              <Text size={300} fontStyle="italic" color="#2E56CD">
                {selectedNumerosCount}
              </Text>
            )}
          </Pane>
        </>
      )}
    </Pane>
  );
}

export default AddNumerosWithPolygon;
