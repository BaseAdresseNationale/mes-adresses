import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Pane,
  Heading,
  Text,
  Paragraph,
  Button,
  Tablist,
  Tab,
  Tooltip,
} from "evergreen-ui";
import { keyBy } from "lodash";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";

import useHelp from "@/hooks/help";

import ConvertVoieWarning from "@/components/convert-voie-warning";
import VoiesList from "@/components/bal/voies-list";
import VoieEditor from "@/components/bal/voie-editor";
import ToponymesList from "@/components/bal/toponymes-list";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import CommuneTab from "@/components/bal/commune-tab";
import { CommuneType } from "@/types/commune";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import BALRecoveryContext from "@/contexts/bal-recovery";
import {
  BaseLocale,
  BasesLocalesService,
  BaseLocaleSync,
  Toponyme,
  Voie,
  VoiesService,
  VoieMetas,
  ExtendedVoieDTO,
  OpenAPI,
} from "@/lib/openapi-api-bal";
import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";
import usePublishProcess from "@/hooks/publish-process";

interface BaseLocalePageProps {
  commune: CommuneType;
}

function BaseLocalePage({ commune }: BaseLocalePageProps) {
  const [editedItem, setEditedItem] = useState<Voie | Toponyme | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toConvert, setToConvert] = useState<string | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const { token } = useContext(TokenContext);
  const { toaster } = useContext(LayoutContext);
  const {
    voies,
    toponymes,
    baseLocale,
    habilitation,
    isHabilitationValid,
    setVoies,
  } = useContext(BalDataContext);
  const { isMobile } = useContext(LayoutContext);
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { handleShowHabilitationProcess } = usePublishProcess(commune);
  const {
    refreshBALSync,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    isEditing,
    setIsEditing,
  } = useContext(BalDataContext);

  const { signalements } = useContext(SignalementContext);

  useHelp(selectedTabIndex);

  useEffect(() => {
    async function addCommentsToVoies() {
      try {
        const voieMetas: VoieMetas[] =
          await BasesLocalesService.findVoieMetasByBal(baseLocale.id);
        const voiesMetasByVoieId = keyBy(voieMetas, "id");
        setVoies((voies: ExtendedVoieDTO[]) =>
          voies.map((v) => ({ ...v, ...voiesMetasByVoieId[v.id] }))
        );
      } catch (e) {
        console.error("Impossible de charger les commentaires de voies", e);
      }
    }

    if (token) {
      addCommentsToVoies();
    }
  }, [token]);

  useEffect(() => {
    if (
      token &&
      baseLocale.status === BaseLocale.status.PUBLISHED &&
      baseLocale.sync?.status === BaseLocaleSync.status.OUTDATED &&
      habilitation &&
      !isHabilitationValid
    ) {
      handleShowHabilitationProcess();
    }
  }, [baseLocale.status, baseLocale.sync?.status, isHabilitationValid, token]);

  useEffect(() => {
    if (token) {
      setSelectedTabIndex(1);
    }
  }, [token]);

  const onPopulate = useCallback(async () => {
    setIsEditing(true);

    await BasesLocalesService.populateBaseLocale(baseLocale.id);
    await reloadVoies();

    setIsEditing(false);
  }, [baseLocale.id, reloadVoies, setIsEditing]);

  const onRemove = useCallback(async () => {
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  }, [refreshBALSync, reloadTiles, reloadParcelles]);

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
        // Select the tab topnyme after conversion
        setSelectedTabIndex(2);
        setEditedItem(toponyme);
        setIsFormOpen(true);
      },
      "La voie a bien été convertie en toponyme",
      "La voie n’a pas pu être convertie en toponyme"
    );

    await convertToponyme();

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    reloadVoies,
    refreshBALSync,
    reloadToponymes,
    reloadTiles,
    reloadParcelles,
    toConvert,
    toaster,
  ]);

  const onEdit = useCallback(
    (idItem: string) => {
      if (idItem) {
        setEditedItem([...voies, ...toponymes].find(({ id }) => id === idItem));
        setIsFormOpen(true);
      } else {
        setEditedItem(null);
        setIsFormOpen(false);
      }
    },
    [voies, toponymes]
  );

  const displayTabContent = () => {
    switch (selectedTabIndex) {
      case 1:
        return (
          <VoiesList
            voies={voies}
            balId={baseLocale.id}
            onEnableEditing={onEdit}
            setToConvert={setToConvert}
            onRemove={onRemove}
            openRecoveryDialog={() => {
              setIsRecoveryDisplayed(true);
            }}
            openForm={() => {
              setIsFormOpen(true);
            }}
          />
        );
      case 2:
        return (
          <ToponymesList
            toponymes={toponymes}
            balId={baseLocale.id}
            onEnableEditing={onEdit}
            onRemove={onRemove}
            openRecoveryDialog={() => {
              setIsRecoveryDisplayed(true);
            }}
            openForm={() => {
              setIsFormOpen(true);
            }}
          />
        );
      default:
        return (
          <CommuneTab
            commune={commune}
            openRecoveryDialog={() => {
              setIsRecoveryDisplayed(true);
            }}
          />
        );
    }
  };

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
      <Pane
        display="flex"
        flexDirection="column"
        background="tint1"
        padding={16}
      >
        <Heading>
          {commune.nom} - {commune.code}
        </Heading>
        {voies && (
          <Text>
            {voies.length} voie{voies.length > 1 ? "s" : ""}
          </Text>
        )}
      </Pane>

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {isFormOpen && selectedTabIndex === 1 && (
          <VoieEditor
            initialValue={editedItem as Voie}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}
        {isFormOpen && selectedTabIndex === 2 && (
          <ToponymeEditor
            initialValue={editedItem as Toponyme}
            commune={commune}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}

        <Pane
          flexShrink={0}
          elevation={0}
          width="100%"
          display="flex"
          padding={10}
        >
          <Tablist>
            {[
              {
                label: "Commune",
                notif: signalements.length,
              },
              {
                label: "Voies",
                tooltip: (
                  <>
                    <p className="custom-tooltip-content">
                      Liste des dénominations officielles auxquelles sont
                      rattachés des numéros.
                    </p>
                    <p className="custom-tooltip-content">
                      Exemple :
                      <br /> 1 <b>Le Voisinet</b>, Breux-sur-Avre
                    </p>
                  </>
                ),
              },
              {
                label: "Toponymes",
                tooltip: (
                  <>
                    <p className="custom-tooltip-content">
                      Liste des voies et lieux-dits qui ne sont pas numérotés.
                    </p>
                    <p className="custom-tooltip-content">
                      Exemple :
                      <br /> 1 Chemin de Boël, <b>Le Voisinet</b>,
                      Breux-sur-Avre
                    </p>
                  </>
                ),
              },
            ].map(({ label, notif, tooltip }, index) => {
              const tab = (
                <Tab
                  position="relative"
                  isSelected={selectedTabIndex === index}
                  onSelect={() => {
                    setSelectedTabIndex(index);
                  }}
                >
                  {label}
                  {notif > 0 && <span className="tab-notif">{notif}</span>}
                </Tab>
              );
              return !isMobile && tooltip ? (
                <Tooltip
                  content={tooltip}
                  key={label}
                  position="top-left"
                  showDelay={500}
                >
                  {tab}
                </Tooltip>
              ) : (
                tab
              );
            })}
          </Tablist>
        </Pane>

        {displayTabContent()}

        {token && voies && voies.length === 0 && (
          <Pane borderTop marginTop="auto" padding={16}>
            <Paragraph size={300} color="muted">
              Vous souhaitez importer les voies de la commune de {commune.nom}{" "}
              depuis la Base Adresse Nationale ?
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
        )}
      </Pane>

      <style jsx>{`
        .tab {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: whitesmoke;
        }

        .tab:hover {
          cursor: pointer;
          background: #e4e7eb;
        }

        .tab.selected {
          background: #fff;
        }

        .tab .selected:hover {
          background: #e4e7eb;
        }

        .tab-notif {
          position: absolute;
          top: -10px;
          right: -5px;
          background: red;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { balId } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);
    return {
      props: {
        commune,
        baseLocale,
        voies,
        toponymes,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default BaseLocalePage;
