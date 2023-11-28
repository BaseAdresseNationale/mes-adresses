import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Pane,
  Heading,
  Text,
  Paragraph,
  Button,
  Tablist,
  Tab,
} from "evergreen-ui";

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
  BasesLocalesService,
  Toponyme,
  Voie,
  VoiesService,
} from "@/lib/openapi";

const TABS = ["Commune", "Voies", "Toponymes"];

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
  const { voies, toponymes, baseLocale } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const {
    refreshBALSync,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    isEditing,
    setIsEditing,
  } = useContext(BalDataContext);

  useHelp(selectedTabIndex);

  useEffect(() => {
    if (token) {
      setSelectedTabIndex(1);
    }
  }, [token]);

  const onPopulate = useCallback(async () => {
    setIsEditing(true);

    await BasesLocalesService.populateBaseLocale(baseLocale._id);
    await reloadVoies();

    setIsEditing(false);
  }, [baseLocale._id, reloadVoies, setIsEditing, token]);

  const onRemove = useCallback(async () => {
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  }, [refreshBALSync, reloadTiles, reloadParcelles]);

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true);
    try {
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
    } catch {}

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    reloadVoies,
    refreshBALSync,
    reloadToponymes,
    reloadTiles,
    reloadParcelles,
    toConvert,
    token,
  ]);

  const onEdit = useCallback(
    (id: string) => {
      if (id) {
        setEditedItem([...voies, ...toponymes].find(({ _id }) => _id === id));
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
            balId={baseLocale._id}
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
            balId={baseLocale._id}
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
            initialValue={editedItem}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}
        {isFormOpen && selectedTabIndex === 2 && (
          <ToponymeEditor
            initialValue={editedItem}
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
            {TABS.map((tab, index) => (
              <Tab
                key={tab}
                isSelected={selectedTabIndex === index}
                onSelect={() => {
                  setSelectedTabIndex(index);
                }}
              >
                {tab}
              </Tab>
            ))}
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
  } catch (e) {
    console.log(e);
    return {
      error: {
        statusCode: 404,
      },
    };
  }
}

export default BaseLocalePage;
