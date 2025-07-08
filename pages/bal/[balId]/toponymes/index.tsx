import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash";
import {
  Table,
  Paragraph,
  Pane,
  AddIcon,
  LockIcon,
  IconButton,
  Text,
  Tooltip,
} from "evergreen-ui";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import DeleteWarning from "@/components/delete-warning";
import {
  BasesLocalesService,
  CommunePrecedenteDTO,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  Numero,
  ToponymesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { useSearchPagination } from "@/hooks/search-pagination";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import PaginationList from "@/components/pagination-list";
import LanguagePreview from "@/components/bal/language-preview";
import TableRowNotifications from "@/components/table-row/table-row-notifications";
import CommentsContent from "@/components/comments-content";
import TableRowActions from "@/components/table-row/table-row-actions";
import BALRecoveryContext from "@/contexts/bal-recovery";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import MapContext from "@/contexts/map";
import SearchPaginationContext from "@/contexts/search-pagination";

interface ToponymesPageProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function ToponymesPage({ baseLocale }: ToponymesPageProps) {
  const { token } = useContext(TokenContext);
  const [toRemove, setToRemove] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    commune,
    toponymes,
    isEditing,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
  } = useContext(BalDataContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const router = useRouter();
  const [page, changePage, search, changeFilter, filtered] =
    useSearchPagination(TabsEnum.TOPONYMES, toponymes);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { reloadTiles } = useContext(MapContext);
  const { scrollAndHighlightLastSelectedItem } = useContext(
    SearchPaginationContext
  );

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">Toponymes</Text>);
    scrollAndHighlightLastSelectedItem(TabsEnum.TOPONYMES);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, scrollAndHighlightLastSelectedItem]);

  const handleRemove = async () => {
    setIsDisabled(true);
    const softDeleteToponyme = toaster(
      () => ToponymesService.softDeleteToponyme(toRemove),
      "Le toponyme a bien été archivé",
      "Le toponyme n’a pas pu être archivé"
    );
    await softDeleteToponyme();
    await reloadToponymes();
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
    setToRemove(null);
    setIsDisabled(false);
  };

  const getCommuneDeleguee = useCallback(
    (codeCommuneDeleguee) => {
      const communeDeleguee: CommunePrecedenteDTO =
        commune.communesDeleguees?.find(
          ({ code }) => code === codeCommuneDeleguee
        );
      return (
        communeDeleguee && `${communeDeleguee.nom} - ${communeDeleguee.code}`
      );
    },
    [commune]
  );

  const browseToNumerosList = (idToponyme: string) => {
    void router.push(
      `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${idToponyme}/numeros`
    );
  };

  const browseToToponyme = (idToponyme: string) => {
    void router.push(
      `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${idToponyme}`
    );
  };

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
      {!token && (
        <Pane flexShrink={0} elevation={0} backgroundColor="white">
          <ReadOnlyInfos
            openRecoveryDialog={() => setIsRecoveryDisplayed(true)}
          />
        </Pane>
      )}
      <Table
        display="flex"
        flex={1}
        flexDirection="column"
        overflowY="auto"
        style={{ borderTop: "none" }}
      >
        <Table.Head background="white">
          <Table.SearchHeaderCell
            placeholder="Rechercher un toponyme"
            onChange={changeFilter}
            value={search}
          />
          <Table.HeaderCell flex="unset">
            <Tooltip content="Ajouter un toponyme">
              <IconButton
                icon={AddIcon}
                title="Ajouter un toponyme"
                is={NextLink}
                appearance="primary"
                intent="success"
                disabled={!token || (token && isEditing)}
                href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/new`}
              />
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

        <PaginationList
          id={`${TabsEnum.TOPONYMES}-list`}
          items={scrollableItems}
          page={page}
          setPage={changePage}
        >
          {(toponyme: ExtentedToponymeDTO & { commentedNumeros: Numero[] }) => (
            <Table.Row
              key={toponyme.id}
              id={toponyme.id}
              paddingRight={8}
              minHeight={48}
            >
              <Table.Cell
                onClick={() => browseToNumerosList(toponyme.id)}
                cursor="pointer"
                className="main-table-cell"
              >
                <Table.TextCell data-editable flex="0 1 1" height="100%">
                  <Pane padding={1} fontSize={15}>
                    <Text>{toponyme.nom}</Text>
                  </Pane>

                  {toponyme.nomAlt && (
                    <Pane marginTop={4}>
                      <LanguagePreview nomsAlt={toponyme.nomAlt} />
                    </Pane>
                  )}
                </Table.TextCell>
              </Table.Cell>

              <TableRowNotifications
                communeDeleguee={getCommuneDeleguee(toponyme.communeDeleguee)}
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
                      commentedNumeros={(
                        toponyme.commentedNumeros as Numero[]
                      ).map(({ comment }) => comment)}
                    />
                  ) : null
                }
              />

              {isEditingEnabled && (
                <TableRowActions
                  onSelect={() => {
                    browseToNumerosList(toponyme.id);
                  }}
                  onEdit={() => {
                    browseToToponyme(toponyme.id);
                  }}
                  onRemove={() => {
                    setToRemove(toponyme.id);
                  }}
                />
              )}

              {!Boolean(token) && (
                <Table.TextCell flex="0 1 1">
                  <IconButton
                    onClick={() => setIsRecoveryDisplayed(true)}
                    type="button"
                    height={24}
                    icon={LockIcon}
                    appearance="minimal"
                  />
                </Table.TextCell>
              )}
            </Table.Row>
          )}
        </PaginationList>
      </Table>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

    return {
      props: {
        baseLocale,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default ToponymesPage;
