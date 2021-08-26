import React from 'react'
import {
  Badge,
  Button,
  ListItem,
  OrderedList,
  Pane,
  Paragraph,
  Strong,
  CaretDownIcon,
  UploadIcon,
  EditIcon
} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'
import Problems from './problems'

const Publication = () => {
  return (
    <Pane>
      <Tuto title='Publier votre Base Adresse Locale'>
        <OrderedList margin={8}>
          <ListItem>
            <Paragraph>
              L‘édition de votre Base Adresse Locale est terminée: <br /> vous pouvez cliquer sur le
              bouton
              <Button margin={5} height={24} appearance='primary'>
                Publier
              </Button>
            </Paragraph>
            <Paragraph>
              <i>
                (Cela vous permettra de différencier les BAL prêtes à être publiées de celles dont
                l‘édition n‘est pas terminée.)
              </i>
            </Paragraph>
          </ListItem>
          <ListItem>
            Le bouton change alors d‘apparence, il devient
            <Button margin={5} height={24} appearance='primary' iconAfter={CaretDownIcon}>
              Publication
            </Button>
          </ListItem>
          <ListItem>
            <Paragraph>
              Cliquez sur &nbsp;
              <Button appearance='default' iconBefore={UploadIcon}>
                Publier
              </Button>
              &nbsp; pour publier votre Base Adresse Locale.
            </Paragraph>
          </ListItem>
          <ListItem>
            <div>
              <Paragraph>
                Vous serez ensuite redirigé vers un formulaire d‘authentification, qui vous
                permettra de vous identifier, puis de publier votre BAL.
              </Paragraph>
              <Paragraph>
                Une fois votre BAL publiée, le bouton est remplacé par &nbsp;
                <Badge color='green' marginRight='8' paddingTop={2} height={20}>
                  Publiée
                </Badge>
              </Paragraph>
              <Paragraph margin='10'>
                <Strong>
                  <i>
                    Pour la mettre à jour, il vous suffit de l‘éditer ici et les changements seront
                    appliqués automatiquement d‘ici quelques jours.
                  </i>
                </Strong>
              </Paragraph>
            </div>
          </ListItem>
          <Tuto title='Bon à savoir'>
            <ListItem listStyleType='none'>
              En mode &nbsp;
              <Badge color='blue' marginRight='8' paddingTop={2} height={20}>
                Prête à être publiée
              </Badge>
              il vous est possible de revenir au mode brouillon en cliquant sur
              <Button margin={5} height={24} appearance='primary' iconAfter={CaretDownIcon}>
                Publication
              </Button>
              puis &nbsp;
              <Button appearance='default' iconBefore={EditIcon}>
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
