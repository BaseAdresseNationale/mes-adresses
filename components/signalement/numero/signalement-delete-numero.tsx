import { Button, Pane } from "evergreen-ui";
import React, { useContext } from "react";
import NumeroEditor from "../../bal/numero-editor";
import { CommuneType } from "@/types/commune";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { softRemoveNumero } from "@/lib/bal-api";
import TokenContext from "@/contexts/token";

interface SignalementDeleteNumeroProps {
  existingLocation: any;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
  commune: CommuneType;
}

function SignalementDeleteNumero({
  existingLocation,
  handleSubmit,
  handleClose,
  commune,
}: SignalementDeleteNumeroProps) {
  const { reloadNumeros, reloadParcelles, refreshBALSync } =
    useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { token } = useContext(TokenContext);

  const onRemove = async (idNumero) => {
    await softRemoveNumero(idNumero, token);
    await reloadNumeros();
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  };

  const handleRemove = async (idNumero) => {
    await onRemove(idNumero);
    await handleSubmit();
  };

  return (
    <Pane position="relative" height="100%">
      <NumeroEditor
        hasPreview
        initialValue={existingLocation}
        initialVoieId={existingLocation.voie?._id}
        commune={commune}
        closeForm={handleClose}
        onSubmitted={handleSubmit}
        certificationBtnChildren={
          <Button
            type="button"
            appearance="primary"
            intent="danger"
            onClick={() => handleRemove(existingLocation._id)}
          >
            Supprimer
          </Button>
        }
      />
    </Pane>
  );
}

export default SignalementDeleteNumero;
