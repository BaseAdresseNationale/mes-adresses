import { Button, Pane } from "evergreen-ui";
import React, { useContext } from "react";
import NumeroEditor from "../../bal/numero-editor";
import { CommuneType } from "@/types/commune";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { Numero, NumerosService, Voie } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";

interface SignalementDeleteNumeroProps {
  existingLocation: Numero & { voie: Voie };
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
  const { toaster } = useContext(LayoutContext);

  const handleRemove = async (idNumero) => {
    const softDeleteNumero = toaster(
      async () => {
        await NumerosService.softDeleteNumero(idNumero);
        await reloadNumeros();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
      },
      "Le numéro a bien été archivé",
      "Le numéro n’a pas pu être archivé"
    );
    await softDeleteNumero();
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
        certificationBtnProps={{
          onConfirm: undefined,
          children: (
            <Button
              type="button"
              appearance="primary"
              intent="danger"
              onClick={() => handleRemove(existingLocation._id)}
            >
              Supprimer
            </Button>
          ),
        }}
      />
    </Pane>
  );
}

export default SignalementDeleteNumero;
