import React, { useContext, useState, useCallback } from "react";
import { Pane } from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { Toponyme } from "@/lib/openapi-api-bal";

import BalDataContext from "@/contexts/bal-data";

import { CommuneType } from "@/types/commune";

import TabsSideBar, { TabsEnum } from "@/components/sidebar/tabs";
import HeaderSideBar from "@/components/sidebar/header";
import MapContext from "@/contexts/map";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import ToponymesList from "@/components/bal/toponymes-list";
import BALRecoveryContext from "@/contexts/bal-recovery";
import PopulateSideBar from "@/components/sidebar/populate";
import TokenContext from "@/contexts/token";

interface ToponymesPageProps {
  commune: CommuneType;
}

function ToponymesPage({ commune }: ToponymesPageProps) {
  const { toponymes, voies, baseLocale, refreshBALSync, reloadParcelles } =
    useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const { reloadTiles } = useContext(MapContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  const [editedItem, setEditedItem] = useState<Toponyme | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const onRemove = useCallback(async () => {
    await reloadParcelles();
    reloadTiles();
    refreshBALSync();
  }, [refreshBALSync, reloadTiles, reloadParcelles]);

  const onEdit = useCallback(
    (idItem: string) => {
      if (idItem) {
        setEditedItem(toponymes.find(({ id }) => id === idItem));
        setIsFormOpen(true);
      } else {
        setEditedItem(null);
        setIsFormOpen(false);
      }
    },
    [toponymes]
  );

  return (
    <>
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
          <ToponymeEditor
            initialValue={editedItem}
            commune={commune}
            closeForm={() => {
              onEdit(null);
            }}
          />
        )}

        <TabsSideBar balId={baseLocale.id} tabSelected={TabsEnum.TOPONYMES} />

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

export default ToponymesPage;
