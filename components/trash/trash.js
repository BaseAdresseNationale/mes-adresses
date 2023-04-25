import {useState, useEffect, useMemo} from 'react'
import {Pane, Tablist, Tab} from 'evergreen-ui'

import useTrash from '@/hooks/trash'

import ItemsDeletedList from '@/components/trash/list/items-deleted-list'
import RestoreVoie from '@/components/trash/restore-voie/index'

const TABS = ['Voies', 'Toponymes']

function Trash() {
  const {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    onRestoreVoie,
    reloadVoiesDeleted,
    reloadToponymesDelete
  } = useTrash()
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [restoreVoie, setRestoreVoie] = useState(null)

  useEffect(() => {
    reloadVoiesDeleted()
    reloadToponymesDelete()
  }, [reloadVoiesDeleted, reloadToponymesDelete])

  const propsDeletedList = useMemo(() => {
    if (selectedTabIndex === 0) {
      return {
        model: 'voie',
        itemsDeleted: voiesDeleted,
        onRestore: setRestoreVoie,
        onRemoveVoie,
        onRemoveNumeros
      }
    }

    return {
      model: 'toponyme',
      itemsDeleted: toponymesDeleted,
      onRestore: onRestoreToponyme,
      onRemove: onRemoveToponyme
    }
  }, [selectedTabIndex, voiesDeleted, toponymesDeleted, setRestoreVoie, onRemoveVoie, onRestoreToponyme, onRemoveToponyme, onRemoveNumeros])

  return (
    <Pane
      position='relative'
      display='flex'
      flexDirection='column'
      height='100%'
      width='100%'
      overflow='hidden'
    >
      {restoreVoie ? (
        <RestoreVoie voie={restoreVoie} onRestoreVoie={onRestoreVoie} onClose={() => setRestoreVoie(null)} />
      ) : (
        <>
          <Pane flexShrink={0} elevation={0} width='100%' display='flex' padding={10}>
            <Tablist>
              {TABS.map(
                (tab, index) => (
                  <Tab
                    key={tab}
                    isSelected={selectedTabIndex === index}
                    onSelect={() => setSelectedTabIndex(index)}
                  >
                    {tab}
                  </Tab>
                )
              )}
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
          background: #E4E7EB;
        }
        .tab.selected {
          background: #fff;
        }
        .tab .selected:hover {
          background: #E4E7EB;
        }
      `}</style>
    </Pane>
  )
}

export default Trash
