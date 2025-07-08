import { useState, useContext, useEffect, useCallback } from "react";
import { Pane, Heading, EditIcon, Text } from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import VoieEditor from "@/components/bal/voie-editor";
import LanguagePreview from "../bal/language-preview";
import { Voie } from "@/lib/openapi-api-bal";

interface VoieHeadingProps {
  voie: Voie;
}

function VoieHeading({ voie }: VoieHeadingProps) {
  const [hovered, setHovered] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { token } = useContext(TokenContext);
  const { editingId, isEditing, numeros } = useContext(BalDataContext);

  const onEnableVoieEditing = useCallback(() => {
    if (!isEditing && token) {
      setIsFormOpen(true);
      setHovered(false);
    }
  }, [isEditing, token]);

  useEffect(() => {
    if (editingId === voie.id) {
      onEnableVoieEditing();
    }
  }, [voie, editingId, onEnableVoieEditing]);

  return isFormOpen ? (
    <Pane background="tint1" padding={0}>
      <VoieEditor initialValue={voie} closeForm={() => setIsFormOpen(false)} />
    </Pane>
  ) : (
    <Pane display="flex" flexDirection="column" background="tint1" padding={16}>
      <Heading
        style={{ cursor: hovered && !isEditing ? "text" : "default" }}
        onClick={onEnableVoieEditing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Pane
          marginBottom={8}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Pane>
            {voie.nom}
            {!isEditing && token && (
              <EditIcon
                marginBottom={-2}
                marginLeft={8}
                color={hovered ? "black" : "muted"}
              />
            )}
          </Pane>
          {numeros && (
            <Text padding={editingId === voie.id ? 16 : 0}>
              {numeros.length} numéro{numeros.length > 1 ? "s" : ""}
            </Text>
          )}
          {voie.comment && (
            <Text color="gray" fontStyle="italic">
              {voie.comment}
            </Text>
          )}
        </Pane>
        {voie.nomAlt && <LanguagePreview nomsAlt={voie.nomAlt} />}
      </Heading>
    </Pane>
  );
}

export default VoieHeading;
