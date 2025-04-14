import React, { useContext, useCallback } from "react";
import { Button, Pane, Paragraph } from "evergreen-ui";

import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import { CommuneDTO } from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";

interface PopulateSideBarProps {
  commune: CommuneDTO;
  baseLocale: BaseLocale;
}

function PopulateSideBar({ commune, baseLocale }: PopulateSideBarProps) {
  const { reloadVoies, setIsEditing, isEditing } = useContext(BalDataContext);

  const onPopulate = useCallback(async () => {
    setIsEditing(true);

    await BasesLocalesService.populateBaseLocale(baseLocale.id);
    await reloadVoies();

    setIsEditing(false);
  }, [baseLocale.id, reloadVoies, setIsEditing]);

  return (
    <Pane borderTop marginTop="auto" padding={16}>
      <Paragraph size={300} color="muted">
        Vous souhaitez importer les voies de la commune de {commune.nom} depuis
        la Base Adresse Nationale ?
      </Paragraph>
      <Button
        marginTop={10}
        appearance="primary"
        disabled={isEditing}
        isLoading={isEditing}
        onClick={onPopulate}
      >
        {isEditing
          ? "Récupération des adresses…"
          : "Récupérer les adresses de la BAN"}
      </Button>
    </Pane>
  );
}

export default PopulateSideBar;
