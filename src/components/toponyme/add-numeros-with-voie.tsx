import {
  useState,
  useCallback,
  useContext,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import { sortBy } from "lodash";
import { SelectField, SelectMenu, Pane, Button, Text } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";

import FormInput from "@/components/form-input";
import { VoiesService } from "@/lib/openapi-api-bal";

interface AddNumerosWithVoieProps {
  numerosIds: string[];
  setNumerosIds: Dispatch<SetStateAction<string[]>>;
}

function AddNumerosWithVoie({
  numerosIds,
  setNumerosIds,
}: AddNumerosWithVoieProps) {
  const [selectedVoieId, setSelectedVoieId] = useState();
  const [voieNumeros, setVoieNumeros] = useState([]);

  const { voies } = useContext(BalDataContext);

  const handleSelectVoie = async (idVoie) => {
    setSelectedVoieId(idVoie);
    if (idVoie) {
      const numeros = await VoiesService.findVoieNumeros(idVoie);
      setVoieNumeros(numeros);
      setNumerosIds(numeros.map(({ id }) => id));
    }
  };

  const handleSelectNumero = ({ value }) => {
    if (value === "toggle") {
      if (numerosIds.length === voieNumeros.length) {
        setNumerosIds([]);
      } else {
        setNumerosIds(voieNumeros.map(({ id }) => id));
      }
    } else {
      setNumerosIds((selectedNumeros) => {
        return selectedNumeros.includes(value)
          ? selectedNumeros.filter((id) => id !== value)
          : [...selectedNumeros, value];
      });
    }
  };

  const selectedVoiesCount = useMemo(() => {
    if (numerosIds.length === voieNumeros.length) {
      return "Tous les numéros sont sélectionnés";
    }

    if (numerosIds.length === 0) {
      return "Aucun numéro n’est sélectionné";
    }

    if (numerosIds.length === 1) {
      return "1 numéro est sélectionné";
    }

    return `${numerosIds.length} numéros sont sélectionnés`;
  }, [numerosIds.length, voieNumeros.length]);

  const numeroOptions = useMemo(() => {
    let options = [];

    if (voieNumeros.length > 0) {
      const toggleFullSelect = {
        label:
          numerosIds.length > 0
            ? "Désélectionner tous les numéros"
            : "Sélectionner tous les numéros",
        value: "toggle",
      };
      const numeros = voieNumeros.map(({ id, numero, suffixe }) => ({
        label: `${numero}${suffixe ? suffixe : ""}`,
        value: id,
      }));

      options = [toggleFullSelect, ...numeros];
    }

    return options;
  }, [numerosIds, voieNumeros]);

  return (
    <Pane>
      <Pane display="flex">
        <FormInput>
          <SelectField
            value={selectedVoieId}
            label="Voie"
            marginBottom={0}
            flex={1}
            onChange={(e) => handleSelectVoie(e.target.value)}
          >
            {!selectedVoieId && <option>- Sélectionnez une voie -</option>}
            {sortBy(voies, (v) => normalizeSort(v.nom)).map(({ id, nom }) => (
              <option key={id} value={id}>
                {nom}
              </option>
            ))}
          </SelectField>

          {selectedVoieId && (
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

              {voieNumeros.length > 0 && (
                <Text size={300} fontStyle="italic" color="#2E56CD">
                  {selectedVoiesCount}
                </Text>
              )}
            </Pane>
          )}
        </FormInput>
      </Pane>
    </Pane>
  );
}

export default AddNumerosWithVoie;
