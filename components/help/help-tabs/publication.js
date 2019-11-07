import React from 'react'
import {Badge, Button, ListItem, OrderedList, Pane} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'
import Problems from './problems'

const Publication = () => {
  return (
    <Pane>
      <Tuto title='Publier votre Base Adresse Locale'>
        <OrderedList margin={8}>
          <ListItem>
            L‘édition de votre Base Adresse Locale est terminée: <br /> vous pouvez cliquer sur le bouton
            <Button margin={5} height={24} appearance='primary'>
              Prêt à publier
            </Button>
            <br />
            <i>(Cela vous permettra de différencier les BAL prêtes à être publiées de celles dont l‘édition n‘est pas terminée.)</i>
          </ListItem>
          <ListItem>
            Le bouton change alors d‘apparence, il devient
            <Button
              margin={5}
              height={24}
              appearance='primary'
              iconAfter='caret-down'
            >
              Publication
            </Button>
          </ListItem>
          <ListItem>
            <p>
              Cliquez sur &nbsp;
              <Button appearance='default' iconBefore='upload'>
                Publier
              </Button>
              &nbsp; pour publier votre Base Adresse Locale.
            </p>
          </ListItem>
          <ListItem>
            <p>
              Vous serez ensuite redirigé vers un formulaire d‘authentification, qui vous permettra de vous identifier, puis de publier votre BAL.<br />
              Une fois votre BAL publiée, le bouton est remplacé par &nbsp;
              <Badge
                color='green'
                marginRight='8'
                paddingTop={2}
                height={20}
              > Publiée
              </Badge>
              <br /><br />
              <b><i>Pour la mettre à jour, il vous suffit de l‘éditer ici et les changements seront appliqués automatiquement d‘ici quelques jours.</i></b>
            </p>
          </ListItem>
          <Tuto title='Bon à savoir'>
            <ListItem listStyleType='none'>
              En mode
              <Button margin={5} height={24} appearance='primary'>
                Prêt à publier
              </Button>
              il vous est possible de revenir au mode brouillon en cliquant sur
              <Button
                margin={5}
                height={24}
                appearance='primary'
                iconAfter='caret-down'
              >
                Publication
              </Button>
               puis &nbsp;
              <Button appearance='default' iconBefore='edit'>
                Revenir au brouillon
              </Button>
            </ListItem>
          </Tuto>
        </OrderedList>
      </Tuto>
      <Problems>
        <Unauthorized title='Je n’arrive pas à éditer ma BAL' />
      </Problems>
    </Pane>
  )
}

export default Publication
