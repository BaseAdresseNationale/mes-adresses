import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sortBy, compact } from "lodash";
import {
  Table,
  Paragraph,
  Pane,
  AddIcon,
  LockIcon,
  Text,
  IconButton,
  FilterIcon,
  FilterRemoveIcon,
  Menu,
  SendToMapIcon,
  EditIcon,
  EndorsedIcon,
  TrashIcon,
  Popover,
  Checkbox,
  WarningSignIcon,
} from "evergreen-ui";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import CommentsContent from "@/components/comments-content";
import DeleteWarning from "@/components/delete-warning";

import {
  BaseLocale,
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { useSearchPagination } from "@/hooks/search-pagination";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import PaginationList from "@/components/pagination-list";
import LanguagePreview from "@/components/bal/language-preview";
import TableRowNotifications from "@/components/table-row/table-row-notifications";
import TableRowActions from "@/components/table-row/table-row-actions";
import DialogWarningAction from "@/components/dialog-warning-action";
import MapContext from "@/contexts/map";
import BALRecoveryContext from "@/contexts/bal-recovery";
import PopulateSideBar from "@/components/sidebar/populate";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import SearchPaginationContext from "@/contexts/search-pagination";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import { VoieGeneratedDocuments } from "@/components/document-generation/voie-generated-documents";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "@/components/document-generation/document-generation.types";
import { GenerateArreteDeNumerotationDialog } from "@/components/document-generation/generate-arrete-de-numerotation-dialog";
import { ButtonIconExpandHover } from "@/components/expand-button-hover/button-expand-hover";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import TableVoieWarning from "@/components/table-row/table-voie-warning";
import AlertsContext from "@/contexts/alerts";
import { AlertVoie, AlertNumero } from "@/lib/alerts/alerts.types";

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
    reloadParcelles,
    refreshBALSync,
    reloadNumeros,
  } = useContext(BalDataContext);
  const { reloadTiles, setTileLayersMode } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const router = useRouter();
  const [toCertify, setToCertify] = useState<string | null>(null);
  const [onCertifyLoading, setOnCertifyLoading] = useState<boolean>(false);
  const [documentGenerationData, setDocumentGenerationData] =
    useState<DocumentGenerationData<GeneratedDocumentType> | null>(null);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showUncertify, setShowUncertify] = useState<boolean>(
    router.query.filters?.includes("uncertified") || false,
  );
  const [showAlerts, setShowAlerts] = useState<boolean>(
    router.query.filters?.includes("alertes") || false,
  );
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const [page, changePage, search, changeFilter, filtered] =
    useSearchPagination(TabsEnum.VOIES, voies);
  const { scrollAndHighlightLastSelectedItem } = useContext(
    SearchPaginationContext,
  );
  const { voiesAlerts, numerosAlerts } = useContext(AlertsContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [setTileLayersMode]);

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">Voies</Text>);
    scrollAndHighlightLastSelectedItem(TabsEnum.VOIES);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, scrollAndHighlightLastSelectedItem]);

  const changeQueryParamsFilters = useCallback(
    (key: string, value: boolean) => {
      if (value) {
        router.query.filters = Array.isArray(router.query.filters)
          ? compact([...router.query.filters, key])
          : compact([router.query.filters, key]);
      } else {
        router.query.filters = Array.isArray(router.query.filters)
          ? (router.query.filters as string[]).filter(
              (filter) => filter !== key,
            )
          : [];
      }
      void router.push(router, undefined, { shallow: true });
    },
    [router],
  );

  const changeUncertified = useCallback(
    (value: boolean) => {
      setShowUncertify(value);
      changeQueryParamsFilters("uncertified", value);
    },
    [changeQueryParamsFilters],
  );

  const changeAlerts = useCallback(
    (value: boolean) => {
      setShowAlerts(value);
      changeQueryParamsFilters("alerts", value);
    },
    [changeQueryParamsFilters],
  );

  const handleRemove = async () => {
    setIsDisabled(true);
    const softDeleteVoie = toaster(
      () => VoiesService.softDeleteVoie(toRemove),
      "La voie a bien été archivée",
      "La voie n’a pas pu être archivée",
    );
    await softDeleteVoie();
    await reloadVoies();
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
    setToRemove(null);
    setIsDisabled(false);
  };

  const onCertify = useCallback(async () => {
    setOnCertifyLoading(true);
    await VoiesService.certifyVoieNumeros(toCertify);
    await reloadVoies();
    await reloadNumeros();
    reloadTiles();
    setOnCertifyLoading(false);
    setToCertify(null);
  }, [toCertify, reloadVoies, reloadNumeros, reloadTiles]);

  const onDownloadArreteDeNumerotation = useCallback(
    async (voieId: string, data: { file?: Blob }) => {
      const downloadArreteDeNumerotation = toaster(
        async () => {
          const url = await VoiesService.generateArreteDeNumerotation(
            voieId,
            data,
          );
          window.open(url, "_blank");
        },
        "L'arrêté de numérotation a bien été téléchargé",
        "L'arrêté de numérotation n'a pas pu être téléchargé",
      );
      await downloadArreteDeNumerotation();
      matomoTrackEvent(
        MatomoEventCategory.DOCUMENT,
        MatomoEventAction[MatomoEventCategory.DOCUMENT]
          .GENERATE_ARRETE_NUMEROTATION_VOIE,
      );
    },
    [toaster, matomoTrackEvent],
  );

  const browseToVoie = (idVoie: string) => {
    void router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}`);
  };

  const browseToNumerosList = (idVoie: string) => {
    void router.push(
      `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}/numeros`,
    );
  };

  const getVoieAlerts = useCallback(
    (voieId: string): (AlertVoie | AlertNumero)[] => {
      const voieWarnings = voiesAlerts[voieId] || [];

      const numerosWarnings = Object.values(numerosAlerts)
        .flat()
        .filter((alert) => alert.voieId === voieId);

      if (numerosWarnings.length > 0) console.log(numerosAlerts);
      return [...voieWarnings, ...numerosWarnings];
    },
    [voiesAlerts, numerosAlerts],
  );

  const scrollableItems = useMemo(() => {
    let items: ExtendedVoieDTO[] = sortBy(filtered, (v) =>
      normalizeSort(v.nom),
    );
    if (showUncertify) {
      items = items.filter(({ isAllCertified }) => !isAllCertified);
    }
    if (showAlerts) {
      items = items.filter(({ id }) => getVoieAlerts(id).length > 0);
    }
    return items;
  }, [filtered, showUncertify, showAlerts, getVoieAlerts]);

  const isEditingEnabled = !isEditing && Boolean(token);

  return (
    <>
      <DialogWarningAction
        confirmLabel="Certifier les numéros de la voie"
        isShown={Boolean(toCertify)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir certifier toutes les adresses de cette
            voie ?
          </Paragraph>
        }
        isLoading={onCertifyLoading}
        onCancel={() => {
          setToCertify(null);
        }}
        onConfirm={onCertify}
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

      <GenerateArreteDeNumerotationDialog
        data={documentGenerationData}
        setData={setDocumentGenerationData}
        onDownload={onDownloadArreteDeNumerotation}
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
        <Pane
          background="white"
          padding={8}
          borderBottom="muted"
          textAlign="center"
        >
          <Text>Voies, places et lieux-dits numérotés</Text>
        </Pane>
        <Table.Head background="white">
          <Table.SearchHeaderCell
            placeholder="Rechercher une voie, une place, un lieu-dit..."
            onChange={changeFilter}
            value={search}
          />
          <Table.HeaderCell flex="unset">
            <Popover
              content={
                <Pane paddingX={16}>
                  <Checkbox
                    label={
                      <Text>
                        Non certifiées{" "}
                        <EndorsedIcon style={{ verticalAlign: "text-top" }} />
                      </Text>
                    }
                    checked={showUncertify}
                    onChange={() => changeUncertified(!showUncertify)}
                  />
                  <Checkbox
                    label={
                      <Text>
                        Avec alertes{" "}
                        <WarningSignIcon
                          style={{ verticalAlign: "text-top" }}
                        />
                      </Text>
                    }
                    checked={showAlerts}
                    onChange={() => changeAlerts(!showAlerts)}
                  />
                </Pane>
              }
            >
              <IconButton
                icon={
                  showUncertify || showAlerts ? FilterRemoveIcon : FilterIcon
                }
                title="filtres voies"
                size="small"
                marginRight={16}
              />
            </Popover>
            <ButtonIconExpandHover
              icon={AddIcon}
              title="Ajouter une voie"
              is={NextLink}
              size="medium"
              appearance="primary"
              intent="success"
              disabled={!token || (token && isEditing)}
              href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/new`}
              message="Ajouter une voie"
            />
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
                  voie.isAllCertified ? "Les adresses sont certifiées" : null
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
                  Boolean(token) && getVoieAlerts(voie.id).length > 0 ? (
                    <TableVoieWarning
                      baseLocale={baseLocale}
                      voie={voie}
                      alerts={getVoieAlerts(voie.id)}
                    />
                  ) : null
                }
              />

              {isEditingEnabled && (
                <TableRowActions>
                  <Menu.Item
                    icon={SendToMapIcon}
                    onSelect={() => {
                      browseToNumerosList(voie.id);
                    }}
                  >
                    Consulter
                  </Menu.Item>
                  <Menu.Item
                    icon={EditIcon}
                    onSelect={() => {
                      browseToVoie(voie.id);
                    }}
                  >
                    Modifier
                  </Menu.Item>
                  {!voie.isAllCertified && (
                    <Menu.Item
                      icon={EndorsedIcon}
                      onSelect={() => {
                        setToCertify(voie.id);
                      }}
                    >
                      Certifier
                    </Menu.Item>
                  )}
                  <Menu.Item
                    icon={TrashIcon}
                    intent="danger"
                    onSelect={() => {
                      setToRemove(voie.id);
                    }}
                  >
                    Supprimer…
                  </Menu.Item>
                  {Boolean(token) &&
                    baseLocale.status === BaseLocale.status.PUBLISHED && (
                      <VoieGeneratedDocuments
                        voie={voie}
                        setDocumentGenerationData={setDocumentGenerationData}
                      />
                    )}
                </TableRowActions>
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
