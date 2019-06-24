import React from 'react'
import {Paragraph, Button} from 'evergreen-ui'

import Tuto from '.'

const Sidebar = () => (
  <Tuto title='Je ne vois pas le menu latéral'>
    <Paragraph marginTop='default'>
      Ce menu peut-être cacher afin de laisser plus d’espace à la cartographie.
    </Paragraph>
    <Paragraph marginTop='default'>
      Pour le faire réapparaitre, cliquez sur le bouton <Button margin={8} iconBefore='chevron-right' />
      en haut à gauche de votre écran.
    </Paragraph>
  </Tuto>
)

export default Sidebar
