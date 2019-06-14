import React from 'react'
import {Pane, Paragraph, OrderedList, ListItem, Text, Button, Menu} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const Communes = () => {
  return (
    <Pane>
      <Tuto title='Ajouter une commune'>
        <Paragraph marginTop='default'>
          Affichez la liste des communes de votre BAL en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Cliquer sur le bouton
            <Button iconBefore='add' margin={8} appearance='primary' intent='success'>Ajouter une commune</Button>
          </ListItem>
          <ListItem>Recherche votre commune puis sélectionnez la dans la liste des suggestions.</ListItem>
          <ListItem>Si vous souhaitez partir de zéro, décochez la case <b>"Importer les voies et numéros depuis la BAN"</b>.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button margin={8} appearance='primary' intent='success'>Ajouter</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Supprimer une commune'>
        <Paragraph marginTop='default'>
          Affichez la liste des communes de votre BAL en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Cliquer sur le bouton <Button iconBefore='more' appearance='minimal' /> se situant à droite du nom de la commune
          </ListItem>
          <ListItem>
            Dans le menu qui vient d’apparaître, choisissez
            <Menu.Item icon='trash' intent='danger'>
              Supprimer…
            </Menu.Item>
          </ListItem>
          <ListItem>Pour terminer, confirmez votre choix en cliquant sur <Button intent='danger' appearance='primary'>Supprimer</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Consulter une commune'>
        <Paragraph marginTop='default'>
          Affichez la liste des communes de votre BAL en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>
            Cliquer sur le bouton <Button iconBefore='more' appearance='minimal' /> se situant à droite du nom de la commune
          </ListItem>
          <ListItem>
            Dans le menu qui vient d’apparaître, choisissez
            <Menu.Item icon='send-to-map'>
              Consulter
            </Menu.Item>
          </ListItem>
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
