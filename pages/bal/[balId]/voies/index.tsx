import React, { useContext, useState, useCallback } from "react";
import { Pane, Paragraph } from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { Toponyme, Voie, VoiesService } from "@/lib/openapi-api-bal";

import BalDataContext from "@/contexts/bal-data";

import { CommuneType } from "@/types/commune";

import ConvertVoieWarning from "@/components/convert-voie-warning";
import VoiesList from "@/components/bal/voies-list";
import TabsSideBar, { TabsEnum } from "@/components/sidebar/tabs";
import HeaderSideBar from "@/components/sidebar/header";
import LayoutContext from "@/contexts/layout";
import MapContext from "@/contexts/map";
import VoieEditor from "@/components/bal/voie-editor";
import BALRecoveryContext from "@/contexts/bal-recovery";
import PopulateSideBar from "@/components/sidebar/populate";
import TokenContext from "@/contexts/token";

interface VoiesPageProps {
  commune: CommuneType;
}

function VoiesPage({ commune }: VoiesPageProps) {
  const {
    voies,
    baseLocale,
    refreshBALSync,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
  } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  const [editedItem, setEditedItem] = useState<Voie | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [toConvert, setToConvert] = useState<string | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const { toaster } = useContext(LayoutContext);

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
        // setSelectedTabIndex(TabsEnum.TOPONYMES);
        // setEditedItem(toponyme);
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

  const onRemove = useCallback(async () => {
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  }, [refreshBALSync, reloadTiles, reloadParcelles]);

  const onEdit = useCallback(
    (idItem: string) => {
      if (idItem) {
        setEditedItem(voies.find(({ id }) => id === idItem));
        setIsFormOpen(true);
      } else {
        setEditedItem(null);
        setIsFormOpen(false);
      }
    },
    [voies]
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
        {isFormOpen && (
          <VoieEditor
            initialValue={editedItem}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}

        <TabsSideBar balId={baseLocale.id} tabSelected={TabsEnum.VOIES} />

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

        {token && voies && voies.length === 0 && (
          <PopulateSideBar commune={commune} baseLocale={baseLocale} />
        )}
      </Pane>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    return {
      props: {
        baseLocale,
        commune,
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

export default VoiesPage;
