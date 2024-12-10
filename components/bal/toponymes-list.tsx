import { useContext, useMemo, useState } from "react";
import { sortBy } from "lodash";
import {
  Table,
  Paragraph,
  Pane,
  Button,
  AddIcon,
  LockIcon,
  IconButton,
  Text,
} from "evergreen-ui";
import { useRouter } from "next/router";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import useFuse from "@/hooks/fuse";

import DeleteWarning from "@/components/delete-warning";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import {
  ExtentedToponymeDTO,
  Numero,
  ToponymesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import LanguagePreview from "./language-preview";
import TableRowNotifications from "../table-row/table-row-notifications";
import CommentsContent from "../comments-content";
import TableRowActions from "../table-row/table-row-actions";

interface ToponymesListProps {
  toponymes: ExtentedToponymeDTO[];
  onRemove: () => Promise<void>;
  onEnableEditing: (id: string) => void;
  balId: string;
  openRecoveryDialog: () => void;
  openForm: () => void;
}

function ToponymesList({
  toponymes,
  onEnableEditing,
  onRemove,
  balId,
  openForm,
  openRecoveryDialog,
}: ToponymesListProps) {
  const { token } = useContext(TokenContext);
  const [toRemove, setToRemove] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const { isEditing, reloadToponymes } = useContext(BalDataContext);
  const { toaster } = useContext(LayoutContext);
  const router = useRouter();

  const handleRemove = async () => {
    setIsDisabled(true);
    const softDeleteToponyme = toaster(
      () => ToponymesService.softDeleteToponyme(toRemove),
      "Le toponyme a bien été archivé",
      "Le toponyme n’a pas pu être archivé"
    );
    await softDeleteToponyme();
    await reloadToponymes();
    await onRemove();
    setToRemove(null);
    setIsDisabled(false);
  };

  const onSelect = (id: string) => {
    void router.push(`/bal/${balId}/toponymes/${id}`);
  };

  const [filtered, setFilter] = useFuse(toponymes, 200, {
    keys: ["nom"],
  });

  const scrollableItems = useMemo(
    () => sortBy(filtered, (v) => normalizeSort(v.nom)),
    [filtered]
  );

  const isEditingEnabled = !isEditing && Boolean(token);

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer ce toponyme ?
          </Paragraph>
        }
        isDisabled={isDisabled}
        onCancel={() => {
          setToRemove(null);
        }}
        onConfirm={handleRemove}
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
            Ajouter un toponyme
          </Button>
        </Pane>
      </Pane>
      <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
        <Table.Head>
          <Table.SearchHeaderCell
            placeholder="Rechercher un toponyme"
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
          {(toponyme: ExtentedToponymeDTO) => (
            <Table.Row key={toponyme.id} paddingRight={8} minHeight={48}>
              <Table.Cell
                onClick={() => onSelect(toponyme.id)}
                cursor="pointer"
                className="main-table-cell"
              >
                <Table.TextCell data-editable flex="0 1 1" height="100%">
                  <Pane padding={1} fontSize={15}>
                    <Text>{toponyme.nom}</Text>
                  </Pane>

                  {toponyme.nomAlt && (
                    <Pane marginTop={4}>
                      <LanguagePreview nomAlt={toponyme.nomAlt} />
                    </Pane>
                  )}
                </Table.TextCell>
              </Table.Cell>

              <TableRowNotifications
                warning={
                  toponyme.positions.length === 0
                    ? "Ce toponyme n’a pas de position"
                    : null
                }
                certification={
                  toponyme.isAllCertified
                    ? "Toutes les adresses de ce toponyme sont certifiées par la commune"
                    : null
                }
                comment={
                  toponyme.commentedNumeros.length > 0 ? (
                    <CommentsContent
                      commentedNumeros={toponyme.commentedNumeros}
                    />
                  ) : null
                }
              />

              {isEditingEnabled && (
                <TableRowActions
                  onSelect={() => {
                    onSelect(toponyme.id);
                  }}
                  onEdit={() => {
                    onEnableEditing(toponyme.id);
                  }}
                  onRemove={() => {
                    setToRemove(toponyme.id);
                  }}
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

export default ToponymesList;
