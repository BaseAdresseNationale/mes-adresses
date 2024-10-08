import { useContext, useMemo, useState } from "react";
import { sortBy } from "lodash";
import {
  Table,
  KeyTabIcon,
  Paragraph,
  Pane,
  Button,
  AddIcon,
  LockIcon,
  Text,
  IconButton,
  EndorsedIcon,
  Tooltip,
  FilterIcon,
  FilterRemoveIcon,
} from "evergreen-ui";
import { useRouter } from "next/router";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import useFuse from "@/hooks/fuse";

import CommentsContent from "@/components/comments-content";
import DeleteWarning from "@/components/delete-warning";

import InfiniteScrollList from "../infinite-scroll-list";
import { ExtendedVoieDTO, Numero, VoiesService } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";
import TableRowActions from "../table-row/table-row-actions";
import TableRowNotifications from "../table-row/table-row-notifications";
import LanguagePreview from "./language-preview";

interface VoiesListProps {
  voies: ExtendedVoieDTO[];
  onRemove: () => Promise<void>;
  onEnableEditing: (id: string) => void;
  balId: string;
  setToConvert: (id: string) => void;
  openRecoveryDialog: () => void;
  openForm: () => void;
}

function VoiesList({
  voies,
  onEnableEditing,
  setToConvert,
  balId,
  onRemove,
  openRecoveryDialog,
  openForm,
}: VoiesListProps) {
  const { token } = useContext(TokenContext);
  const [toRemove, setToRemove] = useState(null);
  const { isEditing, reloadVoies } = useContext(BalDataContext);
  const { toaster } = useContext(LayoutContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showUncertify, setShowUncertify] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsDisabled(true);
    const softDeleteVoie = toaster(
      () => VoiesService.softDeleteVoie(toRemove),
      "La voie a bien été archivée",
      "La voie n’a pas pu être archivée"
    );
    await softDeleteVoie();
    await reloadVoies();
    await onRemove();
    setToRemove(null);
    setIsDisabled(false);
  };

  const onSelect = (id: string) => {
    void router.push(`/bal/${balId}/voies/${id}`);
  };

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: ["nom"],
  });

  const scrollableItems = useMemo(() => {
    const items: ExtendedVoieDTO[] = sortBy(filtered, (v) =>
      normalizeSort(v.nom)
    );
    if (showUncertify) {
      return items.filter(({ isAllCertified }) => !isAllCertified);
    }
    return items;
  }, [filtered, showUncertify]);

  const isEditingEnabled = !isEditing && Boolean(token);

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer cette voie ainsi que tous
            ses numéros ?
          </Paragraph>
        }
        onCancel={() => {
          setToRemove(null);
        }}
        onConfirm={handleRemove}
        isDisabled={isDisabled}
      />
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor="white"
        paddingX={16}
        display="flex"
        alignItems="center"
        minHeight={50}
      >
        <Pane marginLeft="auto">
          <Button
            iconBefore={token ? AddIcon : LockIcon}
            appearance="primary"
            intent="success"
            disabled={token && isEditing}
            onClick={() => {
              if (token) {
                openForm();
              } else {
                openRecoveryDialog();
              }
            }}
          >
            Ajouter une voie
          </Button>
        </Pane>
      </Pane>
      <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
        <Table.Head>
          <Table.SearchHeaderCell
            placeholder="Rechercher une voie, une place, un lieu-dit..."
            onChange={setFilter}
          />
          <Table.HeaderCell flex="unset">
            <Tooltip content="Voir seulement les voies avec des adresses non certifiées">
              <Button
                size="small"
                iconBefore={showUncertify ? FilterRemoveIcon : FilterIcon}
                onClick={() => setShowUncertify(!showUncertify)}
              >
                Non Certifié
              </Button>
            </Tooltip>
          </Table.HeaderCell>
        </Table.Head>

        {filtered.length === 0 && (
          <Table.Row>
            <Table.TextCell color="muted" fontStyle="italic">
              Aucun résultat
            </Table.TextCell>
          </Table.Row>
        )}

        <InfiniteScrollList items={scrollableItems}>
          {(voie: ExtendedVoieDTO & { commentedNumeros: Numero[] }) => (
            <Table.Row key={voie.id} paddingRight={8} minHeight={48}>
              <Table.Cell
                onClick={() => onSelect(voie.id)}
                cursor="pointer"
                className="main-table-cell"
              >
                <Table.TextCell data-editable flex="0 1 1" height="100%">
                  <Pane padding={1} fontSize={15}>
                    <Text>{voie.nom}</Text>
                  </Pane>

                  {voie.nomAlt && (
                    <Pane marginTop={4}>
                      <LanguagePreview nomAlt={voie.nomAlt} />
                    </Pane>
                  )}
                </Table.TextCell>
              </Table.Cell>

              <TableRowNotifications
                certification={
                  voie.isAllCertified
                    ? "Toutes les adresses de cette voie sont certifiées par la commune"
                    : null
                }
                comment={
                  voie.comments.length > 0 ? (
                    <CommentsContent comments={voie.comments} />
                  ) : null
                }
                warning={
                  voie.nbNumeros === 0
                    ? "Cette voie ne contient aucun numéro"
                    : null
                }
              />

              {isEditingEnabled && (
                <TableRowActions
                  onSelect={() => {
                    onSelect(voie.id);
                  }}
                  onEdit={() => {
                    onEnableEditing(voie.id);
                  }}
                  onRemove={() => {
                    setToRemove(voie.id);
                  }}
                  extra={
                    voie.nbNumeros === 0
                      ? {
                          callback: () => {
                            setToConvert(voie.id);
                          },
                          icon: KeyTabIcon,
                          text: "Convertir en toponyme",
                        }
                      : null
                  }
                />
              )}

              {!Boolean(token) && (
                <Table.TextCell flex="0 1 1">
                  <IconButton
                    onClick={openRecoveryDialog}
                    type="button"
                    height={24}
                    icon={LockIcon}
                    appearance="minimal"
                  />
                </Table.TextCell>
              )}
            </Table.Row>
          )}
        </InfiniteScrollList>
      </Table>
    </>
  );
}

export default VoiesList;
