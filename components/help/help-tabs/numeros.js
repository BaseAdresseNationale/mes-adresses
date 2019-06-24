import React from 'react'
import {Pane, Paragraph, OrderedList, ListItem, Strong, Button, Menu, Icon, IconButton} from 'evergreen-ui'

import Tuto from '../tuto'
import SubTuto from '../tuto/sub-tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des numéros d’une voie en la sélectionnant depuis le menu latéral ou en cliquant sur son nom ou un de ses numéros directement depuis la carte.
  </Paragraph>
)

const Numeros = () => {
  return (
    <>
      <Pane>
        <Tuto title='Ajouter un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon='column-layout'>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton
                <Button iconBefore='add' marginX={4} appearance='primary' intent='success'>Ajouter un numéro</Button>
              </ListItem>
              <ListItem>
                Un <Icon icon='map-marker' color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Indiquez le numéro dans le champ <Strong size={500}>Numéro</Strong>
              </ListItem>
              <ListItem>
                Indiquez le suffixe (exemple: bis) dans le champ <Strong size={500}>Suffixe</Strong>
              </ListItem>
              <ListItem>
                Recherchez la voie à laquelle le numéro appartient et sélectionnez la.
                À noter que si une voie est déjà sélectionnée alors elle vous sera proposée par défaut.
              </ListItem>
              <ListItem>
                Sélectionnez le type d’adresse grâce au menu déroulant <Strong size={500}>Type</Strong>
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
                  Cliquez sur le bouton <IconButton marginLeft={8} icon='map-marker' />
                </Pane>
              </ListItem>
              <ListItem>
                Un <Icon icon='map-marker' color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Dans le nouveau menu qui est apparu, indiquez le numéro dans le champ <Strong size={500}>Numéro</Strong>
              </ListItem>
              <ListItem>
                Indiquez le suffixe (exemple: bis) dans le champ <Strong size={500}>Suffixe</Strong>
              </ListItem>
              <ListItem>
                Recherchez la voie à laquelle le numéro appartient et sélectionnez la.
                À noter que si une voie est déjà sélectionnée alors elle vous sera proposée par défaut.
              </ListItem>
              <ListItem>
                Sélectionnez le type d’adresse grâce au menu déroulant <Strong size={500}>Type</Strong>
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
              </ListItem>
            </OrderedList>
          </SubTuto>

        </Tuto>

        <Tuto title='Éditer un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon='column-layout'>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton <Button background='tint1' iconBefore='more' appearance='minimal' /> se situant à droite du numéro
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon='edit'>
                    Modifier
                  </Menu.Item>
                </Pane>
              </ListItem>
              <ListItem>
                Il vous désormais possible de modifier le numéro, le suffixe, le type d’adresse ou encore sa position en déplaçant le <Icon icon='map-marker' color='info' /> sur la carte
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon='map'>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le numéro
              </ListItem>
              <ListItem>
                Il vous désormais possible de modifier le numéro, le suffixe, le type d’adresse ou encore sa position en déplaçant le <Icon icon='map-marker' color='info' /> sur la carte
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Supprimer un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon='column-layout'>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton <Button background='tint1' iconBefore='more' appearance='minimal' /> se situant à droite du numéro
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon='trash' intent='danger'>
                    Supprimer…
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon='map'>
            <OrderedList margin={8}>
              <ListItem>Faites un clique droit sur le numéro</ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon='trash' intent='danger'>
                    Supprimer…
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Ajouter une note ou un commentaire'>
          {before}

          <OrderedList margin={8}>
            <ListItem>
                Cliquez sur le bouton <Button background='tint1' iconBefore='more' appearance='minimal' /> se situant à droite du numéro
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='tint1' marginLeft={8} icon='edit'>
                    Modifier
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>
                Remplissez le champ de texte <Strong size={500}>Commentaire</Strong> afin de laisser une note concernant le numéro
            </ListItem>
            <ListItem>
              Pour enregistrer votre commentaire, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Modifier</Button>
            </ListItem>
          </OrderedList>

          <Paragraph>
            Vous remarquerez un <Icon icon='comment' /> sur la ligne du numéro. Le survolez vous permettra de faire apparaitre le commentaire.
          </Paragraph>
        </Tuto>

        <Problems>
          <Tuto title='Je ne trouve pas de voie lorsque j’ajoute un numéro depuis la carte'>
            <Paragraph marginTop='default'>
              Avant de créer un numéro depuis la carte, assurez vous que la voie à laquelle il appartient a bien été créée.
            </Paragraph>
          </Tuto>

          <Unauthorized title='Je n’arrive pas à ajouter/supprimer un numéro' />

          <Sidebar />
        </Problems>
      </Pane>
    </>
  )
}

export default Numeros
