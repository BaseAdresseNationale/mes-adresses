import {Pane, Paragraph, OrderedList, ListItem, Strong, Menu, Button, AddIcon, ColumnLayoutIcon, MapIcon, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

import Tuto from '@/components/help/tuto'
import SubTuto from '@/components/help/tuto/sub-tuto'
import Unauthorized from '@/components/help/tuto/unauthorized'
import Sidebar from '@/components/help/tuto/sidebar'
import Problems from '@/components/help/help-tabs/problems'
import VideoContainer from '@/components/help/video-container'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des voies d’une commune en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
  </Paragraph>
)

function Voies() {
  return (
    <Pane>
      <VideoContainer
        title='Création / Modification d’une voie :'
        link='https://peertube.adresse.data.gouv.fr/w/rgksUPigy8KWnmx8WFELDN'
      />
      <Tuto title='Ajouter une voie'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton
            <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter une voie</Button>
          </ListItem>
          <ListItem>
            Entrez le nom de la voie que vous souhaitez créer dans le champ <Strong size={500} fontStyle='italic'>Nom de la voie…</Strong>
          </ListItem>
          <ListItem>
            Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Renommer une voie'>
        {before}

        <OrderedList margin={8}>
          <ListItem>Cliquez sur le du nom de la voie</ListItem>
          <ListItem>Éditez le nom de la voie</ListItem>
          <ListItem>
            Pour terminer, cliquez sur <Button marginX={4} appearance='primary' intent='success'>Enregistrer</Button>
          </ListItem>
        </OrderedList>

      </Tuto>

      <Tuto title='Consulter une voie'>
        {before}

        <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
          <OrderedList margin={8}>
            <ListItem>
              Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la voie
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='tint1' marginLeft={8} icon={SendToMapIcon}>
                  Consulter
                </Menu.Item>
              </Pane>
            </ListItem>
          </OrderedList>
        </SubTuto>

        <SubTuto title='Depuis la carte' icon={MapIcon}>
          <OrderedList margin={8}>
            <ListItem>Cliquez sur le nom de la voie ou sur l’un de ses numéros</ListItem>
          </OrderedList>
        </SubTuto>
      </Tuto>

      <Tuto title='Supprimer une voie'>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la voie
          </ListItem>
          <ListItem>
            <Pane display='flex' alignItems='center'>
              Dans le menu qui vient d’apparaître, choisissez
              <Menu.Item background='tint1' marginLeft={8} icon={TrashIcon} intent='danger'>
                Supprimer…
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>Pour terminer, confirmez votre choix en cliquant sur <Button marginX={4} intent='danger' appearance='primary'>Supprimer</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Problems>
        <Unauthorized title='Je n’arrive pas à ajouter/supprimer une voie' />
        <Sidebar />
      </Problems>
    </Pane>
  )
}

export default Voies
