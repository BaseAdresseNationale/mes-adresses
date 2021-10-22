import React from 'react'
import {Pane, Paragraph, OrderedList, ListItem, Strong, Button, Menu, IconButton, MapMarkerIcon, CommentIcon, ColumnLayoutIcon, Badge, AddIcon, MapIcon, MoreIcon, EditIcon, TrashIcon, EndorsedIcon, PlusIcon} from 'evergreen-ui'

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
        <Tuto title='Bon à savoir'>
          <ListItem listStyleType='none'>
            Pour renforcer la qualité des adresses, nous vous recommandons de certifier la totalité de vos adresses. <b>Une adresse certifiée est déclarée authentique par la mairie</b>, ce qui renforce la qualité de la Base Adresse Locale et facilite sa réutilisation.
          </ListItem>
        </Tuto>
        <Tuto title='Ajouter un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton
                <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter un numéro</Button>
              </ListItem>
              <ListItem>
                Un <MapMarkerIcon color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
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
                Vous pouvez également créer une nouvelle voie directement en cliquant sur <Button marginX={4} iconBefore={PlusIcon}>Créer une voie</Button>.
                Vous serez automatiquement redirigé vers cette voie.
              </ListItem>
              <ListItem>
                Sélectionnez la position grâce au menu déroulant <Strong size={500}>Type</Strong>
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={EndorsedIcon}>Certifier et enregister</Button> si vous validez cette adresse ou <Button marginX={4} intent='success'>Enregister</Button> pour vous laisser le temps de vérifier avant de certifier.
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Cliquez sur le bouton <IconButton marginLeft={8} icon={MapMarkerIcon} />
                </Pane>
              </ListItem>
              <ListItem>
                Un <MapMarkerIcon color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
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
                Vous pouvez également créer une nouvelle voie directement en cliquant sur <Button marginX={4} iconBefore={PlusIcon}>Créer une voie</Button>.
                Vous serez automatiquement redirigé vers cette voie.
              </ListItem>
              <ListItem>
                Sélectionnez la position grâce au menu déroulant <Strong size={500}>Type</Strong>
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={EndorsedIcon}>Certifier et enregister</Button> si vous validez cette adresse ou <Button marginX={4} intent='success'>Enregister</Button> pour vous laisser le temps de vérifier avant de certifier.
              </ListItem>
            </OrderedList>
          </SubTuto>

        </Tuto>

        <Tuto title='Éditer un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton <Button background='gray100' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du numéro
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='gray100' marginLeft={8} icon={EditIcon}>
                    Modifier
                  </Menu.Item>
                </Pane>
              </ListItem>
              <ListItem>
                Il vous est désormais possible de modifier le numéro, le suffixe, le type d’adresse ou encore sa position en déplaçant le <MapMarkerIcon icon={MapMarkerIcon} color='info' /> sur la carte et de certifier votre adresse.
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le numéro
              </ListItem>
              <ListItem>
                Il vous est désormais possible de modifier le numéro, le suffixe, le type d’adresse ou encore sa position en déplaçant le <MapMarkerIcon icon={MapMarkerIcon} color='info' /> sur la carte et de certifier votre adresse.
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Supprimer un numéro'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton <Button background='gray100' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du numéro
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='gray100' marginLeft={8} icon={TrashIcon} intent='danger'>
                    Supprimer…
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>Faites un clique droit sur le numéro</ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='gray100' marginLeft={8} icon={TrashIcon} intent='danger'>
                    Supprimer…
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Ne plus certifier une adresse'>
          <OrderedList margin={8}>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                Affichez la liste des numéros d’une voie en la sélectionnant depuis le menu latéral ou en cliquant sur son nom ou sur un de ses numéros directement depuis la carte.
              </Pane>
            </ListItem>
            <ListItem>
              En bas de page, cliquez sur le bouton <Button marginX={4} intent='danger'>Ne plus certifier et enregistrer</Button>
            </ListItem>
          </OrderedList>
        </Tuto>

        <Tuto title='Associer des parcelles'>
          {before}

          <OrderedList margin={8}>
            <ListItem>
              Cliquez sur le bouton <Button background='gray100' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du numéro
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='gray100' marginLeft={8} icon={EditIcon}>
                  Modifier
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>
              Depuis la carte, cliquez sur la ou les parcelles que vous souhaitez associer au numéro
            </ListItem>
            <ListItem>
              Pour enregistrer les parcelles, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={EndorsedIcon}>Certifier et enregister</Button> ou <Button marginX={4} intent='success'>Enregister</Button> si vous ne souhaitez pas certifier cette adresse pour le moment.
            </ListItem>
          </OrderedList>

          <Pane>
            <Strong>Code couleur des parcelles :</Strong>
            <Paragraph display='flex'>
              <Badge margin={4} height='100%' color='green'>parcelle associée</Badge>
              <Badge margin={4} height='100%' color='yellow'>parcelle pouvant être associée</Badge>
              <Badge margin={4} height='100%' color='red'>parcelle pouvant être dissociée</Badge>
            </Paragraph>
          </Pane>
        </Tuto>

        <Tuto title='Ajouter une note ou un commentaire'>
          {before}

          <OrderedList margin={8}>
            <ListItem>
              Cliquez sur le bouton <Button background='gray100' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du numéro
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='gray100' marginLeft={8} icon={EditIcon}>
                  Modifier
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>
              Remplissez le champ de texte <Strong size={500}>Commentaire</Strong> afin de laisser une note concernant le numéro
            </ListItem>
            <ListItem>
              Pour enregistrer votre commentaire, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={EndorsedIcon}>Certifier et enregister</Button> ou <Button marginX={4} intent='success'>Enregister</Button> si vous ne souhaitez pas certifier cette adresse pour le moment.
            </ListItem>
          </OrderedList>

          <Paragraph>
            Vous remarquerez un <CommentIcon /> sur la ligne du numéro. Le survoler vous permettra de faire apparaitre le commentaire.
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
