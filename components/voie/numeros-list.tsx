import { useState, useCallback, useMemo, useContext } from "react";
import { sortBy } from "lodash";
import {
  Pane,
  Paragraph,
  Heading,
  Button,
  Table,
  Checkbox,
  AddIcon,
  LockIcon,
  IconButton,
  DownloadIcon,
  Menu,
  TrashIcon,
  EditIcon,
  Tooltip,
} from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";

import useFuse from "@/hooks/fuse";

import DeleteWarning from "@/components/delete-warning";
import GroupedActions from "@/components/grouped-actions";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import BALRecoveryContext from "@/contexts/bal-recovery";
import {
  BasesLocalesService,
  CommunePrecedenteDTO,
  Numero,
  NumerosService,
} from "@/lib/openapi-api-bal";
import TableRowActions from "../table-row/table-row-actions";
import TableRowNotifications from "../table-row/table-row-notifications";
import LayoutContext from "@/contexts/layout";
import NumeroHeading from "./numero-heading";
import { CommuneType } from "@/types/commune";
import {
  CertificatGenerationData,
  GenerateCertificatDialog,
} from "../generate-certificat-dialog";
import LocalStorageContext from "@/contexts/local-storage";

interface NumerosListProps {
  commune: CommuneType;
  token?: string;
  voieId: string;
  numeros: Array<Numero>;
  handleEditing: (id?: string) => void;
}

const fuseOptions = {
  keys: ["numeroComplet"],
};

function NumerosList({
  commune,
  token = null,
  voieId,
  numeros,
  handleEditing,
}: NumerosListProps) {
  const [isRemoveWarningShown, setIsRemoveWarningShown] = useState(false);
  const [certificatGenerationData, setCertificatGenerationData] =
    useState<CertificatGenerationData | null>(null);
  const [selectedNumerosIds, setSelectedNumerosIds] = useState([]);
  const { toaster } = useContext(LayoutContext);

  const {
    baseLocale,
    isEditing,
    reloadNumeros,
    reloadParcelles,
    refreshBALSync,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { certificatEmetteur, setCertificatEmetteur } =
    useContext(LocalStorageContext);

  const [isDisabled, setIsDisabled] = useState(false);

  const [filtered, setFilter] = useFuse(numeros, 200, fuseOptions);

  const scrollableItems = useMemo(
    () =>
      sortBy(filtered, (n) => {
        normalizeSort(n.numeroComplet);
      }),
    [filtered]
  );

  const isGroupedActionsShown = useMemo(
    () => token && numeros && selectedNumerosIds.length > 1,
    [token, numeros, selectedNumerosIds]
  );

  const noFilter = numeros && filtered.length === numeros.length;

  const isAllSelected = useMemo(() => {
    const isAllNumerosSelected =
      noFilter && selectedNumerosIds.length === numeros.length;
    const isAllFilteredNumerosSelected =
      !noFilter && filtered.length === selectedNumerosIds.length;

    return isAllNumerosSelected || isAllFilteredNumerosSelected;
  }, [numeros, noFilter, selectedNumerosIds, filtered]);

  const isAllSelectedCertifie = useMemo(() => {
    const filteredNumeros = numeros?.filter((numero) =>
      selectedNumerosIds.includes(numero.id)
    );
    const filteredCertifieNumeros = filteredNumeros?.filter(
      (numero) => numero.certifie
    );

    return filteredCertifieNumeros?.length === selectedNumerosIds.length;
  }, [numeros, selectedNumerosIds]);

  const handleSelect = useCallback(
    (id) => {
      setSelectedNumerosIds((selectedNumero) => {
        if (selectedNumero.includes(id)) {
          return selectedNumerosIds.filter((f) => f !== id);
        }

        return [...selectedNumerosIds, id];
      });
    },
    [selectedNumerosIds]
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNumerosIds([]);
    } else {
      setSelectedNumerosIds(filtered.map(({ id }) => id));
    }
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

  const onRemove = useCallback(
    async (idNumero) => {
      const softDeleteNumero = toaster(
        async () => {
          await NumerosService.softDeleteNumero(idNumero);
          await reloadNumeros();
          await reloadParcelles();
          reloadTiles();
          refreshBALSync();
        },
        "Le numéro a bien été archivé",
        "Le numéro n’a pas pu être archivé"
      );
      await softDeleteNumero();
    },
    [reloadNumeros, reloadParcelles, refreshBALSync, reloadTiles, toaster]
  );

  const onDownloadCertificat = useCallback(
    async (data) => {
      const downloadCertificat = toaster(
        async () => {
          const { numeroId, ...rest } = data;
          const url = await NumerosService.generateCertificat(numeroId, rest);
          window.open(url, "_blank");
        },
        "Le certificat d'adressage a bien été téléchargé",
        "Le certificat d'adressage n'a pas pu être téléchargé"
      );
      await downloadCertificat();
      if (data.rememberEmetteur) {
        setCertificatEmetteur(data.emetteur);
      } else {
        setCertificatEmetteur(null);
      }
    },
    [toaster, setCertificatEmetteur]
  );

  const onMultipleRemove = async () => {
    setIsDisabled(true);
    const softDeleteNumeros = toaster(
      async () => {
        await BasesLocalesService.softDeleteNumeros(baseLocale.id, {
          numerosIds: selectedNumerosIds,
        });

        await reloadNumeros();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();

        setSelectedNumerosIds([]);
        setIsRemoveWarningShown(false);
      },
      "Les numéros ont bien été archivés",
      "Les numéros n’ont pas pu être archivés"
    );
    await softDeleteNumeros();
    setIsDisabled(false);
  };

  const onMultipleEdit = async (balId, body) => {
    const updateNumeros = toaster(
      async () => {
        await BasesLocalesService.updateNumeros(balId, body);
        await reloadNumeros();
        refreshBALSync();
      },
      "Les numéros ont bien été modifiés",
      "Les numéros n’ont pas pu être modifiés"
    );
    await updateNumeros();
  };

  const generateCertificatButton = useCallback(
    (numero) => {
      const menuItem = (
        <Menu.Item
          icon={DownloadIcon}
          disabled={!numero.certifie || numero.parcelles.length === 0}
          onSelect={() =>
            setCertificatGenerationData({
              numeroId: numero.id,
              destinataire: "",
              emetteur: certificatEmetteur || "",
              rememberEmetteur: Boolean(certificatEmetteur),
            })
          }
        >
          Générer un certificat d&apos;adressage
        </Menu.Item>
      );

      if (!numero.certifie || numero.parcelles.length === 0) {
        return (
          <Tooltip content="Le certificat d'adressage ne peut être généré que pour un numéro certifié et lié à au moins une parcelle">
            {menuItem}
          </Tooltip>
        );
      }

      return menuItem;
    },
    [certificatEmetteur]
  );

  const isEditingEnabled = !isEditing && Boolean(token);

  return (
    <>
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane>
          <Heading>Liste des numéros</Heading>
        </Pane>

        <Pane marginLeft="auto">
          <Button
            iconBefore={token ? AddIcon : LockIcon}
            appearance="primary"
            intent="success"
            onClick={
              token
                ? () => {
                    handleEditing();
                  }
                : () => {
                    setIsRecoveryDisplayed(true);
                  }
            }
          >
            Ajouter un numéro
          </Button>
        </Pane>
      </Pane>

      {isGroupedActionsShown && (
        <GroupedActions
          commune={commune}
          idVoie={voieId}
          numeros={numeros}
          selectedNumerosIds={selectedNumerosIds}
          resetSelectedNumerosIds={() => {
            setSelectedNumerosIds([]);
          }}
          setIsRemoveWarningShown={setIsRemoveWarningShown}
          isAllSelectedCertifie={isAllSelectedCertifie}
          onSubmit={onMultipleEdit}
        />
      )}

      <DeleteWarning
        isShown={isRemoveWarningShown}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer tous les numéros
            sélectionnés ?
          </Paragraph>
        }
        onCancel={() => {
          setIsRemoveWarningShown(false);
        }}
        onConfirm={onMultipleRemove}
        isDisabled={isDisabled}
      />

      <GenerateCertificatDialog
        certificatGenerationData={certificatGenerationData}
        setCertificatGenerationData={setCertificatGenerationData}
        onDownloadCertificat={onDownloadCertificat}
      />

      <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
        <Table.Head background="white">
          {numeros && token && filtered.length > 1 && (
            <Table.Cell flex="0 1 1">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
            </Table.Cell>
          )}
          <Table.SearchHeaderCell
            placeholder="Rechercher un numéro"
            onChange={setFilter}
          />
        </Table.Head>

        {filtered.length === 0 && (
          <Table.Row>
            <Table.TextCell color="muted" fontStyle="italic">
              Aucun numéro
            </Table.TextCell>
          </Table.Row>
        )}

        <InfiniteScrollList items={scrollableItems}>
          {(numero: Numero) => (
            <Table.Row key={numero.id} paddingRight={8} minHeight={48}>
              {isEditingEnabled && (
                <Table.Cell flex="0 1 1">
                  <Checkbox
                    checked={selectedNumerosIds.includes(numero.id)}
                    onChange={
                      filtered.length > 1
                        ? () => {
                            handleSelect(numero.id);
                          }
                        : null
                    }
                  />
                </Table.Cell>
              )}

              <Table.Cell
                className="main-table-cell"
                {...(isEditingEnabled
                  ? {
                      onClick: () => {
                        handleEditing(numero.id);
                      },
                      cursor: "pointer",
                    }
                  : {
                      cursor: "default",
                    })}
              >
                <Table.TextCell data-editable flex="0 1 1" height="100%">
                  <NumeroHeading numero={numero} />
                </Table.TextCell>
              </Table.Cell>

              {numero.positions.length > 1 && (
                <Table.TextCell flex="0 1 1">
                  {numero.positions.length} positions
                </Table.TextCell>
              )}

              <TableRowNotifications
                communeDeleguee={getCommuneDeleguee(numero.communeDeleguee)}
                certification={
                  numero.certifie
                    ? "Cette adresse est certifiée par la commune"
                    : null
                }
                comment={numero.comment}
              />

              {isEditingEnabled && (
                <TableRowActions>
                  <Menu.Item
                    icon={EditIcon}
                    onSelect={() => {
                      handleEditing(numero.id);
                    }}
                  >
                    Modifier
                  </Menu.Item>
                  {generateCertificatButton(numero)}
                  <Menu.Item
                    icon={TrashIcon}
                    intent="danger"
                    onSelect={onRemove}
                  >
                    Supprimer…
                  </Menu.Item>
                </TableRowActions>
              )}

              {!Boolean(token) && (
                <Table.TextCell flex="0 1 1">
                  <IconButton
                    onClick={() => {
                      setIsRecoveryDisplayed(true);
                    }}
                    title="Récupérer les accès d'administration de la BAL"
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

export default NumerosList;
