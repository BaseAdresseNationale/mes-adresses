import { useState, useCallback } from "react";
import { Pane, Heading, Button, AddIcon, CrossIcon } from "evergreen-ui";

import ListNumerosDeleted from "@/components/trash/restore-voie/list-numeros-deleted";
import LanguagePreview from "@/components/bal/language-preview";
import { Numero, Voie } from "@/lib/openapi-api-bal";

interface RestoreVoieProps {
  voie: Voie & { numeros: Numero[] };
  onRestoreVoie: (voie: Voie, selectedNumerosIds: string[]) => void;
  onClose: () => void;
}

function RestoreVoie({ voie, onRestoreVoie, onClose }: RestoreVoieProps) {
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([]);

  const restaurerText = () => {
    return (
      "Restaurer " +
      (voie.deletedAt
        ? "voie" +
          (selectedNumerosIds.length > 0
            ? " avec " + selectedNumerosIds.length + " numero(s)"
            : "")
        : selectedNumerosIds.length + " numéro(s)")
    );
  };

  const handleRestoreVoie = useCallback(async () => {
    await onRestoreVoie(voie, selectedNumerosIds);
    onClose();
  }, [onRestoreVoie, voie, selectedNumerosIds, onClose]);

  return (
    <>
      <Pane
        display="flex"
        flexDirection="column"
        background="tint1"
        padding={16}
      >
        <Heading>
          <Pane marginBottom={8}>
            <Pane>{voie.nom}</Pane>
            {voie.nomAlt && <LanguagePreview nomsAlt={voie.nomAlt} />}
          </Pane>
        </Heading>
        <Pane display="flex" flexDirection="row" justifyContent="end">
          <Button
            iconBefore={AddIcon}
            appearance="primary"
            display="inline-flex"
            onClick={() => handleRestoreVoie()}
            disabled={!voie.deletedAt && selectedNumerosIds.length <= 0}
          >
            {restaurerText()}
          </Button>
          <Button
            iconBefore={CrossIcon}
            appearance="minimal"
            display="inline-flex"
            onClick={() => onClose()}
            marginLeft={10}
          >
            Annuler
          </Button>
        </Pane>
      </Pane>
      <ListNumerosDeleted
        numeros={voie.numeros}
        selectedNumerosIds={selectedNumerosIds}
        setSelectedNumerosIds={setSelectedNumerosIds}
      />
    </>
  );
}

export default RestoreVoie;
