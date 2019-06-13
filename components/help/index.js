import React, {useContext} from 'react'
import {Pane, SideSheet, Paragraph, Heading, Tablist, Tab} from 'evergreen-ui'

import HelpContext from '../../contexts/help'

import HelpTabs, {TABS} from './help-tabs'

const Help = () => {
  const {showHelp, setShowHelp, selectedIndex, setSelectedIndex} = useContext(HelpContext)

  return (
    <>
      <SideSheet
        isShown={showHelp}
        containerProps={{
          display: 'flex',
          flex: '1',
          flexDirection: 'column'
        }}
        onCloseComplete={() => setShowHelp(false)}
      >
        <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor='white'>
          <Pane padding={16} borderBottom='muted'>
            <Heading size={600}>Besoin d’aide ?</Heading>
          </Pane>
          <Pane display='flex' padding={8}>
            <Tablist>
              {TABS.map(
                (tab, index) => (
                  <Tab
                    key={tab}
                    isSelected={selectedIndex === index}
                    onSelect={() => setSelectedIndex(index)}
                  >
                    {tab}
                  </Tab>
                )
              )}
            </Tablist>
          </Pane>
        </Pane>

        <Pane flex='1' overflowY='scroll' background='tint1' padding={16}>
          <HelpTabs tab={selectedIndex} />
        </Pane>

        <Pane padding={16} background='tint2'>
          <Heading>Vous n’avez pas trouvez la solution à votre problème ?</Heading>
          <Paragraph>
            Contactez nous sur <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>
          </Paragraph>
        </Pane>

      </SideSheet>
    </>
  )
}

export default Help
