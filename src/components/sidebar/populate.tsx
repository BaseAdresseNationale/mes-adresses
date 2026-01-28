import React, { useContext, useCallback } from "react";
import { Button, Pane, Paragraph } from "evergreen-ui";

import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";

interface PopulateSideBarProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function PopulateSideBar({ baseLocale }: PopulateSideBarProps) {
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
        Vous souhaitez importer les voies de la commune de{" "}
        {baseLocale.communeNom} depuis la Base Adresse Nationale ?
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
