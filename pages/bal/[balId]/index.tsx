import React, { useState, useCallback, useContext, useEffect } from "react";
import { keyBy } from "lodash";
import { Pane, Paragraph } from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";

import CommuneTab from "@/components/bal/commune-tab";
import { CommuneType } from "@/types/commune";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import BALRecoveryContext from "@/contexts/bal-recovery";
import TabsSideBar, { TabsEnum } from "@/components/sidebar/tabs";
import {
  BaseLocale,
  BaseLocaleSync,
  Toponyme,
  Voie,
  VoiesService,
  VoieMetas,
  ExtendedVoieDTO,
  BasesLocalesService,
} from "@/lib/openapi-api-bal";
import usePublishProcess from "@/hooks/publish-process";
import HeaderSideBar from "@/components/sidebar/header";
import PopulateSideBar from "@/components/sidebar/populate";
import { useRouter } from "next/router";
import VoieEditor from "@/components/bal/voie-editor";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import VoiesList from "@/components/bal/voies-list";
import MapContext from "@/contexts/map";
import LayoutContext from "@/contexts/layout";
import ToponymesList from "@/components/bal/toponymes-list";
import ConvertVoieWarning from "@/components/convert-voie-warning";

interface BaseLocalePageProps {
  selectedTab: TabsEnum;
  commune: CommuneType;
}

function BaseLocalePage({ commune }: BaseLocalePageProps) {
  const [editedItem, setEditedItem] = useState<Voie | Toponyme | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toConvert, setToConvert] = useState<string | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);

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
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { handleShowHabilitationProcess } = usePublishProcess(commune);
  const { refreshBALSync, reloadVoies, reloadToponymes, reloadParcelles } =
    useContext(BalDataContext);

  const router = useRouter();
  const selectedTab: TabsEnum =
    (router.query.selectedTab as TabsEnum) || TabsEnum.VOIES;

  let help: number = 0;
  if (selectedTab == TabsEnum.VOIES) {
    help = 1;
  } else if (selectedTab == TabsEnum.TOPONYMES) {
    help = 2;
  }
  useHelp(help);

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
  }, [baseLocale.id, setVoies, token]);

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
        router.query.selectedTab = TabsEnum.TOPONYMES;
        await router.push(router, undefined, { shallow: true });
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
    router,
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
      <HeaderSideBar commune={commune} voies={voies} />
      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {isFormOpen && selectedTab === TabsEnum.VOIES && (
          <VoieEditor
            initialValue={editedItem as Voie}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}
        {isFormOpen && selectedTab === TabsEnum.TOPONYMES && (
          <ToponymeEditor
            initialValue={editedItem as Toponyme}
            commune={commune}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}

        <TabsSideBar selectedTab={selectedTab} balId={baseLocale.id} />

        {selectedTab === TabsEnum.COMMUNE && (
          <CommuneTab
            commune={commune}
            openRecoveryDialog={() => {
              setIsRecoveryDisplayed(true);
            }}
          />
        )}

        {selectedTab === TabsEnum.VOIES && (
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
        )}

        {selectedTab === TabsEnum.TOPONYMES && (
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
        )}

        {token && voies && voies.length === 0 && (
          <PopulateSideBar commune={commune} baseLocale={baseLocale} />
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
