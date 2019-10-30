import React from 'react'
import { Button, ListItem, OrderedList, Pane, Paragraph, Tab} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'
import Problems from './problems'

const Publication = () => {
  return (
    <Pane>
      <Tuto title='Publier votre Base Adresse Locale'>
        <Paragraph marginTop='default'>
          L'édition de votre Base Adresse Locale est terminée: <br /> vous pouvez cliquer sur le bouton
          <Button margin={5} height={24} appearance='primary'>
            Prêt à publier
          </Button>
          <br />
          <i>(Cela vous permettra de différencier les BAL prêtes à être publiées de celles dont l'édition n'est pas terminée.)</i>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Le bouton change alors d'apparence, il devient 
            <Button
              margin={5} 
              height={24} 
              appearance='primary'
              iconAfter='caret-down'
            >
              Publication
            </Button>
          </ListItem>
          <ListItem>Deux choix s'offrent à vous: 
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur &nbsp;
                <Button appearance='default' iconBefore='upload'>
                  Publier
                </Button>
                <p>
                  Pour publier votre Base Adresse Locale.
                </p>
              </ListItem>
              <ListItem>
                Cliquez sur &nbsp;
                <Button appearance='default' iconBefore='edit'>
                  Revenir au brouillon
                </Button>
                <p>
                  Pour revenir à l'édition de votre Base Adresse Locale. <br /> Vous revenez alors au mode <Tab isSelected>Brouillon</Tab>: vous pouvez effectuer des modifications à votre Base Adresse Locale.
                </p>
              </ListItem>
            </OrderedList>
          </ListItem>
        </OrderedList>
      </Tuto>
      <Problems>
        <Unauthorized title='Je n’arrive pas à éditer ma BAL' />
      </Problems>
    </Pane>
  )
}

export default Publication