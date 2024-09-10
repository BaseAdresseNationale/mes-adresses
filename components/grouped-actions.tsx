import { useContext, useState, useCallback, useEffect } from "react";
import {
  Pane,
  Button,
  Heading,
  Dialog,
  Paragraph,
  Text,
  SelectField,
  Checkbox,
  Alert,
  EditIcon,
  TrashIcon,
} from "evergreen-ui";
import { sortBy, uniq } from "lodash";

import { normalizeSort } from "@/lib/normalize";
import { positionsTypesList } from "@/lib/positions-types-list";

import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";

import { useInput, useCheckboxInput } from "@/hooks/input";

import Comment from "@/components/comment";
import CertificationButton from "@/components/certification-button";
import FormInput from "@/components/form-input";
import { Numero } from "@/lib/openapi";

interface GroupedActionsProps {
  idVoie: string;
  numeros: Numero[];
  selectedNumerosIds: string[];
  resetSelectedNumerosIds: () => void;
  setIsRemoveWarningShown: (value: boolean) => void;
  isAllSelectedCertifie: boolean;
  onSubmit: (baseLocaleId: string, data: any) => Promise<void>;
}

function GroupedActions({
  idVoie,
  numeros,
  selectedNumerosIds,
  resetSelectedNumerosIds,
  setIsRemoveWarningShown,
  isAllSelectedCertifie,
  onSubmit,
}: GroupedActionsProps) {
  const { voies, toponymes, baseLocale } = useContext(BalDataContext);

  const [isShown, setIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoieId, setSelectedVoieId] = useState(idVoie);
  const [comment, onCommentChange] = useInput("");
  const [removeAllComments, onRemoveAllCommentsChange] =
    useCheckboxInput(false);
  const [certifie, setCertifie] = useState(null);
  const { reloadTiles } = useContext(MapContext);

  const selectedNumeros = numeros.filter(({ id }) =>
    selectedNumerosIds.includes(id)
  );

  const selectedNumerosUniqType = uniq(
    selectedNumeros.map((numero) => numero.positions[0].type)
  );
  const hasMultiposition = Boolean(
    selectedNumeros.find((numero) => numero.positions.length > 1)
  );
  const hasComment = selectedNumeros.some((numero) => numero.comment);

  const selectedNumerosUniqVoie = uniq(
    selectedNumeros.map((numero) => numero.voieId)
  );

  // Returns a unique position type, if selected numeros have only one and the same position type
  const getDefaultPositionType = useCallback(() => {
    if (!hasMultiposition && selectedNumerosUniqType.length === 1) {
      return selectedNumerosUniqType[0];
    }

    return "";
  }, [hasMultiposition, selectedNumerosUniqType]);

  const [positionType, onPositionTypeChange, resetPositionType] = useInput(
    getDefaultPositionType()
  );
  const selectedNumerosUniqToponyme = uniq(
    selectedNumeros.map((numero) => numero.toponymeId)
  );
  const hasUniqToponyme = selectedNumerosUniqToponyme.length === 1;

  const getDefaultToponyme = useCallback(() => {
    if (hasUniqToponyme) {
      return selectedNumerosUniqToponyme[0];
    }

    return null;
  }, [hasUniqToponyme, selectedNumerosUniqToponyme]);

  const [selectedToponymeId, setSelectedToponymeId] =
    useState(getDefaultToponyme);

  const handleClick = () => {
    setIsShown(true);
    resetPositionType();
  };

  const onFormCancel = () => {
    resetSelectedNumerosIds();
    setIsShown(false);
  };

  const handleConfirm = useCallback(
    async (event) => {
      event.preventDefault();

      const commentCondition = (commentValue) => {
        if (removeAllComments) {
          return null;
        }

        if (commentValue) {
          return commentValue;
        }
      };

      const getIsCertifie = (isCertifie) => {
        if (isCertifie !== null) {
          return isCertifie;
        }
      };

      setIsLoading(true);

      const changes = {
        comment: commentCondition(comment),
        certifie: getIsCertifie(certifie),
      } as any;

      if (idVoie !== selectedVoieId) {
        changes.voieId = selectedVoieId;
      }

      if (hasUniqToponyme) {
        changes.toponymeId =
          selectedToponymeId === "" ? null : selectedToponymeId;
      }

      if (positionType) {
        changes.positionType = positionType;
      }

      await onSubmit(baseLocale.id, {
        numerosIds: selectedNumerosIds,
        changes,
      });

      setIsLoading(false);
      setIsShown(false);
      reloadTiles();
      resetSelectedNumerosIds();
    },
    [
      comment,
      selectedVoieId,
      certifie,
      hasUniqToponyme,
      selectedToponymeId,
      onSubmit,
      positionType,
      removeAllComments,
      resetSelectedNumerosIds,
      baseLocale,
      selectedNumerosIds,
      idVoie,
      reloadTiles,
    ]
  );

  useEffect(() => {
    if (!isShown) {
      setSelectedToponymeId(getDefaultToponyme);
    }
  }, [isShown, getDefaultToponyme]);

  return (
    <Pane padding={16}>
      <Pane marginBottom={5}>
        <Heading>Actions groupées</Heading>
      </Pane>
      <Pane>
        <Dialog
          isShown={isShown}
          intent="success"
          title="Modification multiple"
          isConfirmLoading={isLoading}
          hasFooter={false}
          onCloseComplete={() => onFormCancel()}
        >
          <Pane marginX="-32px" marginBottom="-8px">
            <Paragraph
              marginBottom={8}
              marginLeft={32}
              color="muted"
            >{`${selectedNumerosIds.length} numéros sélectionnés`}</Paragraph>
            <Pane
              is="form"
              background="gray300"
              flex={1}
              padding={12}
              height="auto"
              onSubmit={handleConfirm}
            >
              <FormInput>
                <SelectField
                  value={selectedVoieId}
                  label="Voie"
                  margin={0}
                  flex={1}
                  disabled={selectedNumerosUniqVoie.length > 1}
                  onChange={(event) => setSelectedVoieId(event.target.value)}
                >
                  {sortBy(voies, (v) => normalizeSort(v.nom)).map(
                    ({ id, nom }) => (
                      <option key={id} value={id}>
                        {nom}
                      </option>
                    )
                  )}
                </SelectField>
              </FormInput>

              {selectedNumerosUniqVoie.length > 1 && (
                <Alert intent="none" marginBottom={8}>
                  Les numéros sélectionnés ne sont pas situés sur la même voie.
                  La modification groupée de la voie n’est pas possible. Ils
                  doivent être modifiés séparément.
                </Alert>
              )}

              <Pane display="flex">
                <FormInput>
                  <SelectField
                    value={selectedToponymeId || ""}
                    label="Toponyme"
                    margin={0}
                    flex={1}
                    disabled={selectedNumerosUniqToponyme.length > 1}
                    onChange={(event) =>
                      setSelectedToponymeId(event.target.value)
                    }
                  >
                    <option value="">
                      {selectedToponymeId || selectedToponymeId === ""
                        ? "Ne pas associer de toponyme"
                        : "- Choisir un toponyme -"}
                    </option>
                    {sortBy(toponymes, (t) => normalizeSort(t.nom)).map(
                      ({ id, nom }) => (
                        <option key={id} value={id}>
                          {nom}
                        </option>
                      )
                    )}
                  </SelectField>
                </FormInput>
              </Pane>

              {selectedNumerosUniqToponyme.length > 1 && (
                <Alert intent="none" marginBottom={8}>
                  Les numéros sélectionnés ne possèdent pas le même toponyme. La
                  modification groupée du toponyme n’est pas possible. Ils
                  doivent être modifiés séparément.
                </Alert>
              )}

              <FormInput>
                <SelectField
                  value={positionType}
                  disabled={hasMultiposition}
                  flex={1}
                  label="Type de position"
                  margin={0}
                  display="block"
                  onChange={onPositionTypeChange}
                >
                  {(selectedNumerosUniqType.length !== 1 ||
                    hasMultiposition) && (
                    <option value="">
                      -- Veuillez choisir un type de position --
                    </option>
                  )}
                  {positionsTypesList.map((positionType) => (
                    <option key={positionType.value} value={positionType.value}>
                      {positionType.name}
                    </option>
                  ))}
                </SelectField>
              </FormInput>

              {hasMultiposition && (
                <Alert intent="none" marginBottom={8}>
                  Certains numéros sélectionnés possèdent plusieurs positions.
                  La modification groupée du type de position n’est pas
                  possible. Ils doivent être modifiés séparément.
                </Alert>
              )}

              <Comment
                input={comment}
                isDisabled={removeAllComments}
                onChange={onCommentChange}
              />

              {hasComment && (comment.length > 0 || removeAllComments) && (
                <Alert intent="warning" title="Attention" marginBottom={8}>
                  <Text>
                    certains numéros sélectionnés possèdent un commentaire. En
                    cas de {removeAllComments ? "suppression" : "modification"},
                    leurs commentaires seront{" "}
                    {removeAllComments ? "supprimés" : "remplacés"}.
                  </Text>
                </Alert>
              )}

              {hasComment && (
                <Checkbox
                  label="Effacer tous les commentaires"
                  checked={removeAllComments}
                  onChange={onRemoveAllCommentsChange}
                />
              )}

              <CertificationButton
                isLoading={isLoading}
                isCertified={isAllSelectedCertifie}
                onConfirm={setCertifie}
                onCancel={onFormCancel}
              />
            </Pane>
          </Pane>
        </Dialog>

        <Button
          iconBefore={EditIcon}
          appearance="primary"
          onClick={() => handleClick()}
        >
          Modifier les numéros
        </Button>
        <Button
          marginLeft={16}
          iconBefore={TrashIcon}
          intent="danger"
          onClick={() => setIsRemoveWarningShown(true)}
        >
          Supprimer les numéros
        </Button>
      </Pane>
    </Pane>
  );
}

export default GroupedActions;
