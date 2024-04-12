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
} from "evergreen-ui";
import { useRouter } from "next/router";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import useFuse from "@/hooks/fuse";

import TableRow from "@/components/table-row";
import CommentsContent from "@/components/comments-content";
import DeleteWarning from "@/components/delete-warning";

import InfiniteScrollList from "../infinite-scroll-list";
import { ExtendedVoieDTO, Numero, VoiesService } from "@/lib/openapi";

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
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setIsDisabled(true);
    await VoiesService.softDeleteVoie(toRemove);
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

  const scrollableItems = useMemo(
    () => sortBy(filtered, (v) => normalizeSort(v.nom)),
    [filtered]
  );

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
            placeholder="Rechercher une voie"
            onChange={setFilter}
          />
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
            <TableRow
              key={voie._id}
              label={voie.nom}
              nomAlt={voie.nomAlt}
              isAdmin={Boolean(token)}
              isEditing={Boolean(isEditing)}
              actions={{
                onSelect: () => {
                  onSelect(voie._id);
                },
                onEdit: () => {
                  onEnableEditing(voie._id);
                },
                onRemove: () => {
                  setToRemove(voie._id);
                },
                extra:
                  voie.nbNumeros === 0
                    ? {
                        callback: () => {
                          setToConvert(voie._id);
                        },
                        icon: KeyTabIcon,
                        text: "Convertir en toponyme",
                      }
                    : null,
              }}
              notifications={{
                certification: voie.isAllCertified
                  ? "Toutes les adresses de cette voie sont certifiées par la commune"
                  : null,
                comment:
                  voie.commentedNumeros.length > 0 ? (
                    <CommentsContent comments={voie.commentedNumeros} />
                  ) : null,
                warning:
                  voie.nbNumeros === 0
                    ? "Cette voie ne contient aucun numéro"
                    : null,
              }}
              openRecoveryDialog={openRecoveryDialog}
            />
          )}
        </InfiniteScrollList>
      </Table>
    </>
  );
}

export default VoiesList;
