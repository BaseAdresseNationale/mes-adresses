import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash";
import {
  Table,
  Paragraph,
  Pane,
  AddIcon,
  LockIcon,
  Text,
  IconButton,
  Tooltip,
  FilterIcon,
  FilterRemoveIcon,
  Button,
} from "evergreen-ui";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import CommentsContent from "@/components/comments-content";
import DeleteWarning from "@/components/delete-warning";

import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  Toponyme,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { useSearchPagination } from "@/hooks/search-pagination";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import PaginationList from "@/components/pagination-list";
import LanguagePreview from "@/components/bal/language-preview";
import TableRowNotifications from "@/components/table-row/table-row-notifications";
import TableRowActions from "@/components/table-row/table-row-actions";
import ConvertVoieWarning from "@/components/convert-voie-warning";
import MapContext from "@/contexts/map";
import BALRecoveryContext from "@/contexts/bal-recovery";
import PopulateSideBar from "@/components/sidebar/populate";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import SearchPaginationContext from "@/contexts/search-pagination";

interface VoiesPageProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function VoiesPage({ baseLocale }: VoiesPageProps) {
  const { token } = useContext(TokenContext);
  const [toRemove, setToRemove] = useState(null);
  const {
    voies,
    isEditing,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);

  const [toConvert, setToConvert] = useState<string | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showUncertify, setShowUncertify] = useState(false);
  const router = useRouter();
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const [page, changePage, search, changeFilter, filtered] =
    useSearchPagination(TabsEnum.VOIES, voies);
  const { scrollAndHighlightLastSelectedItem } = useContext(
    SearchPaginationContext
  );

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">Voies</Text>);
    scrollAndHighlightLastSelectedItem(TabsEnum.VOIES);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, scrollAndHighlightLastSelectedItem]);

  const onRemove = useCallback(async () => {
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  }, [refreshBALSync, reloadTiles, reloadParcelles]);

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

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true);
    const convertToponyme = toaster(
      async () => {
        const toponyme: Toponyme =
          await VoiesService.convertToToponyme(toConvert);
        await reloadVoies();
        await reloadToponymes();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`
        );
      },
      "La voie a bien été convertie en toponyme",
      "La voie n’a pas pu être convertie en toponyme"
    );

    await convertToponyme();

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    baseLocale,
    router,
    reloadVoies,
    refreshBALSync,
    reloadToponymes,
    reloadTiles,
    reloadParcelles,
    toConvert,
    toaster,
  ]);

  const browseToVoie = (idVoie: string) => {
    void router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}`);
  };

  const browseToNumerosList = (idVoie: string) => {
    void router.push(
      `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}/numeros`
    );
  };

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
      <ConvertVoieWarning
        isShown={Boolean(toConvert)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir convertir cette voie en toponyme ?
          </Paragraph>
        }
        isLoading={onConvertLoading}
        onCancel={() => {
          setToConvert(null);
        }}
        onConfirm={onConvert}
      />
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
      {!token && (
        <Pane flexShrink={0} elevation={0} backgroundColor="white">
          <ReadOnlyInfos
            openRecoveryDialog={() => setIsRecoveryDisplayed(true)}
          />
        </Pane>
      )}
      {token && voies && voies.length === 0 && (
        <PopulateSideBar baseLocale={baseLocale} />
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
            placeholder="Rechercher une voie, une place, un lieu-dit..."
            onChange={changeFilter}
            value={search}
          />
          <Table.HeaderCell flex="unset">
            <Tooltip content="Voir seulement les voies avec des adresses non certifiées">
              <IconButton
                size="small"
                title="Voir seulement les voies avec des adresses non certifiées"
                marginRight={16}
                icon={showUncertify ? FilterRemoveIcon : FilterIcon}
                onClick={() => setShowUncertify(!showUncertify)}
              />
            </Tooltip>
            <Tooltip content="Ajouter une voie">
              <IconButton
                icon={AddIcon}
                title="Ajouter une voie"
                is={NextLink}
                appearance="primary"
                intent="success"
                disabled={!token || (token && isEditing)}
                href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/new`}
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
          id={`${TabsEnum.VOIES}-list`}
          items={scrollableItems}
          page={page}
          setPage={changePage}
        >
          {(voie: ExtendedVoieDTO) => (
            <Table.Row
              id={voie.id}
              key={voie.id}
              paddingRight={8}
              minHeight={48}
            >
              <Table.Cell
                onClick={() => browseToNumerosList(voie.id)}
                cursor="pointer"
                className="main-table-cell"
              >
                <Table.TextCell data-editable flex="0 1 1" height="100%">
                  <Pane padding={1} fontSize={15}>
                    <Text>{voie.nom}</Text>
                  </Pane>

                  {voie.nomAlt && (
                    <Pane marginTop={4}>
                      <LanguagePreview nomsAlt={voie.nomAlt} />
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
                  voie.comment?.length || voie.commentedNumeros?.length > 0 ? (
                    <CommentsContent
                      mainComment={voie.comment}
                      commentedNumeros={voie.commentedNumeros}
                    />
                  ) : null
                }
                warning={
                  voie.nbNumeros === 0
                    ? (<>
                        <Text style={{ color: 'white' }}>Cette voie ne contient aucun numéro</Text>
                        <br /><br />
                        <Button onClick={() => setToConvert(voie.id)}>Convertir en toponyme</Button>
                      </>)
                    : null
                }
              />

              {isEditingEnabled && (
                <TableRowActions
                  onSelect={() => {
                    browseToNumerosList(voie.id);
                  }}
                  onEdit={() => {
                    browseToVoie(voie.id);
                  }}
                  onRemove={() => {
                    setToRemove(voie.id);
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

export default VoiesPage;
