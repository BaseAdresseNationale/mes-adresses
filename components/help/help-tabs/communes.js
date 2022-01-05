import {Pane, Paragraph, OrderedList, Strong, ListItem, Button, Menu, AddIcon, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des communes en cliquant sur le nom de votre BAL se trouvant en haut à gauche de votre écran.
  </Paragraph>
)

function Communes() {
  return (
    <Pane>
      <Tuto title='Ajouter une commune'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton
            <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter une commune</Button>
          </ListItem>
          <ListItem>Recherchez votre commune puis sélectionnez la dans la liste des suggestions.</ListItem>
          <ListItem>Si vous souhaitez partir de zéro, décochez la case <Strong size={500} fontStyle='italic'>Importer les voies et numéros depuis la BAN</Strong>.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button></ListItem>
        </OrderedList>

        <Tuto title='Bon à savoir'>
          <ListItem listStyleType='none'>
            L’éditeur « Mes Adresses » permet la gestion d’une Base Adresse Locale à l’échelle communale. Pour gérer plusieurs communes, vous devez créer plusieurs Bases Adresses Locales. L’ajout d’une commune n’est possible que si aucune commune n’est renseignée.
          </ListItem>
        </Tuto>
      </Tuto>

      <Tuto title='Consulter une commune'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton <Button iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la commune
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
      </Tuto>

      <Tuto title='Supprimer une commune'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton <Button iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la commune
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
        <Unauthorized title='Je n’arrive pas à ajouter/supprimer une commune' />
        <Sidebar />
      </Problems>
    </Pane>
  )
}

export default Communes
