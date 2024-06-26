import { useState, useEffect, useMemo } from "react";
import { Pane, Tablist, Tab, TrashIcon, Heading } from "evergreen-ui";

import useTrash from "@/hooks/trash";

import ItemsDeletedList from "@/components/trash/list/items-deleted-list";
import RestoreVoie from "@/components/trash/restore-voie/index";

const TABS = ["Voies", "Toponymes"];

function Trash() {
  const {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    onRestoreVoie,
    reloadAllDeleted,
  } = useTrash();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [restoreVoie, setRestoreVoie] = useState(null);

  useEffect(() => {
    reloadAllDeleted();
  }, [reloadAllDeleted]);

  const propsDeletedList = useMemo(() => {
    if (selectedTabIndex === 0) {
      return {
        model: "voie",
        itemsDeleted: voiesDeleted,
        onRestore: setRestoreVoie,
        onRemove: onRemoveVoie,
        onRemoveNumeros,
      };
    }

    return {
      model: "toponyme",
      itemsDeleted: toponymesDeleted,
      onRestore: onRestoreToponyme,
      onRemove: onRemoveToponyme,
    };
  }, [
    selectedTabIndex,
    voiesDeleted,
    toponymesDeleted,
    setRestoreVoie,
    onRemoveVoie,
    onRestoreToponyme,
    onRemoveToponyme,
    onRemoveNumeros,
  ]);

  return (
    <Pane>
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <TrashIcon />
          <Heading paddingLeft={5}>Corbeille</Heading>
        </Pane>
      </Pane>
      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {restoreVoie ? (
          <RestoreVoie
            voie={restoreVoie}
            onRestoreVoie={onRestoreVoie}
            onClose={() => setRestoreVoie(null)}
          />
        ) : (
          <>
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
                    onSelect={() => setSelectedTabIndex(index)}
                  >
                    {tab}
                  </Tab>
                ))}
              </Tablist>
            </Pane>

            <ItemsDeletedList {...propsDeletedList} />
          </>
        )}

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
      </Pane>
    </Pane>
  );
}

export default Trash;
