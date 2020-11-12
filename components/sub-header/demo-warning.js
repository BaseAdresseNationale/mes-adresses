import React from 'react'
import {Pane, Text, Button, Icon} from 'evergreen-ui'

const DemoWarning = () => {
  return (
    <Pane
      position='fixed'
      top={116}
      left={0}
      height={40}
      width='100%'
      backgroundColor='#F7D154'
      elevation={0}
      zIndex={3}
      display='flex'
      flexDirection='column'
      justifyContent='center'
    >
      <div
        style={{margin: 'auto', textAlign: 'center'}}
      >
        <Icon icon='warning-sign' size={20} marginX='.5em' style={{verticalAlign: 'sub'}} />
        <Text>
          Vous gérez actuellement une Base Adresse Locale de démonstration. Tous les changements peuvent être perdus.
        </Text>
        <Button height={24} marginX='.5em' onClick={() => console.log('plop')}>Transformer en Base Adresse Locale</Button>
      </div>
    </Pane>
  )
}

export default DemoWarning
