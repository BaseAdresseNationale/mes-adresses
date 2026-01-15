import { useEffect, useState } from "react";
import { sortBy } from "lodash";
import {
  Button,
  Pane,
  Text,
  PlusIcon,
  PropertyIcon,
  SelectField,
} from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import useFocus from "@/hooks/focus";

import AssistedTextField from "@/components/assisted-text-field";

interface NumeroVoieSelectorProps {
  voieId: string | null;
  nomVoie: string;
  voies: any[];
  mode: "creation" | "selection";
  validationMessage: string | null;
  handleVoie: (voieId: string | null) => void;
  handleNomVoie: (nomVoie: string) => void;
}

function NumeroVoieSelector({
  voieId = null,
  voies,
  nomVoie = "",
  mode = "selection",
  validationMessage = null,
  handleVoie,
  handleNomVoie,
}: NumeroVoieSelectorProps) {
  const [isCreateMode, setIsCreateMode] = useState(
    mode === "creation" || !voieId
  );
  const [ref, setIsFocus] = useFocus(true);

  const toggleMode = () => {
    setIsCreateMode((mode) => !mode);
  };

  const handleNomVoieChange = (e) => {
    handleNomVoie(e.target.value);
  };

  const handleVoieChange = (e) => {
    const idVoie = e.target.value;
    handleVoie(idVoie ?? null);
  };

  useEffect(() => {
    if (isCreateMode) {
      handleNomVoie("");
    }
  }, [isCreateMode, handleNomVoie]);

  return (
    <Pane display="flex" flex={1} alignItems="flex-end">
      <Pane>
        {isCreateMode ? (
          <AssistedTextField
            forwadedRef={ref}
            exitFocus={() => setIsFocus(false)}
            label="Nouvelle voie"
            placeholder="Nom de la voie"
            value={nomVoie}
            validationMessage={validationMessage}
            onChange={handleNomVoieChange}
          />
        ) : (
          <SelectField
            required
            label="Voie"
            flex={1}
            value={voieId}
            margin={0}
            onChange={handleVoieChange}
          >
            {!voieId && <option value="">- Choisir une voie-</option>}
            {sortBy(voies, (v) => normalizeSort(v.nom)).map(({ id, nom }) => (
              <option key={id} value={id}>
                {nom}
              </option>
            ))}
          </SelectField>
        )}
      </Pane>

      <Text marginX={16}>OU</Text>

      <Button
        type="button"
        iconBefore={isCreateMode ? PropertyIcon : PlusIcon}
        onClick={toggleMode}
      >
        {isCreateMode ? "Choisir" : "Créer"} une voie
      </Button>
    </Pane>
  );
}

export default NumeroVoieSelector;
