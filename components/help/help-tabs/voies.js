import React from 'react'
import {Pane, Paragraph, OrderedList, ListItem, Strong, Menu, Button, Icon, IconButton} from 'evergreen-ui'

import Tuto from '../tuto'
import SubTuto from '../tuto/sub-tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des voies d’une commune en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
  </Paragraph>
)

const Voies = () => {
  return (
    <>
      <Pane>
        <Tuto title='Ajouter une voie'>
          {before}
          <OrderedList margin={8}>
            <ListItem>
              Cliquer sur le bouton
              <Button iconBefore='add' marginX={4} appearance='primary' intent='success'>Ajouter une voie</Button>
            </ListItem>
            <ListItem>
              Entrez le nom de la voie que vous souhaitez créer dans le champs <Strong size={500} fontStyle='italic'>Nom de la voie…</Strong>
            </ListItem>
            <ListItem>
              Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
            </ListItem>
          </OrderedList>
        </Tuto>

        <Tuto title='Ajouter un toponyme'>
          <SubTuto title='Depuis le menu latéral' icon='column-layout'>
            {before}

            <OrderedList margin={8}>
              <ListItem>
                Cliquer sur le bouton
                <Button iconBefore='add' marginX={4} appearance='primary' intent='success'>Ajouter une voie</Button>
              </ListItem>
              <ListItem>
                Cochez la case <Strong size={500} fontStyle='italic'>Cette voie est un toponyme</Strong>
              </ListItem>
              <ListItem>
                Entrez le nom du toponyme que vous souhaitez créer dans le champs <Strong size={500} fontStyle='italic'>Nom du toponyme…</Strong>
              </ListItem>
              <ListItem>
                Un <Icon icon='map-marker' color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon='map'>
            <OrderedList margin={8}>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Cliquer sur le bouton <IconButton marginLeft={8} icon='map-marker' />
                </Pane>
              </ListItem>
              <ListItem>
                Un <Icon icon='map-marker' color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Dans le nouveau menu qui est apparu, cochez la case <Strong size={500} fontStyle='italic'>Cette voie est un toponyme</Strong>
              </ListItem>
              <ListItem>
                Entrez le nom du toponyme que vous souhaitez créer dans le champs <Strong size={500} fontStyle='italic'>Nom du toponyme…</Strong>
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Renommer une voie'>
          {before}

          <OrderedList margin={8}>
            <ListItem>Cliquer sur le du nom de la voie</ListItem>
            <ListItem>Éditer le nom de la voie</ListItem>
            <ListItem>
              Pour terminer, cliquez sur <Button marginX={4} appearance='primary' intent='success'>Modifier</Button>
            </ListItem>
          </OrderedList>

        </Tuto>

        <Tuto title='Supprimer une voie'>
          {before}

          <OrderedList margin={8}>
            <ListItem>
              Cliquer sur le bouton <Button background='tint1' iconBefore='more' appearance='minimal' /> se situant à droite du nom de la voie
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
              Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='tint1' marginLeft={8} icon='trash' intent='danger'>
                Supprimer…
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>Pour terminer, confirmez votre choix en cliquant sur <Button marginX={4} intent='danger' appearance='primary'>Supprimer</Button></ListItem>
          </OrderedList>

        </Tuto>

        <Tuto title='Consulter une voie'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon='column-layout'>
            <OrderedList margin={8}>
              <ListItem>
                Cliquer sur le bouton <Button background='tint1' iconBefore='more' appearance='minimal' /> se situant à droite du nom de la voie
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon='send-to-map'>
                    Consulter
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon='map'>
            <OrderedList margin={8}>
              <ListItem>Cliquez sur le nom de la voie ou sur l’un de ses numéros</ListItem>
            </OrderedList>
          </SubTuto>

        </Tuto>

        <Problems>
          <Unauthorized title='Je n’arrive pas à ajouter/supprimer une voie' />
          <Sidebar />
        </Problems>
      </Pane>
    </>
  )
}

export default Voies
