import {OrderedList, Pane, ListItem, Button, AddIcon, MapMarkerIcon, Menu, MoreIcon, Paragraph, Tab, Heading, Badge, Strong, EditIcon, Text, TrashIcon, Select} from 'evergreen-ui'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des toponymes d’une commune en cliquant sur le nom de celle-ci en haut à gauche de votre écran
  </Paragraph>
)

function Toponymes() {
  return (
    <Pane>
      <Tuto title='Ajouter un toponyme'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Sélectionnez l‘onglet <Tab><Heading size={300}>Liste des Toponymes</Heading></Tab>, puis cliquez sur <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter un toponyme</Button>
          </ListItem>
          <ListItem>
            Entrez le nom du toponyme dans le champs <Text color='muted'><i>Nom du toponyme...</i></Text>
          </ListItem>
          <ListItem>
            Un <MapMarkerIcon color='info' /> est apparu sur la carte, vous pouvez le déplacer pour assigner une ou plusieurs positions à votre toponyme.<br />
            Vous pouvez préciser le type de position avec le menu déroulant <Select><option>Segment</option></Select>
            Si vous ne souhaitez pas définir de position pour le toponyme, cliquez simplement sur <TrashIcon marginX={6} color='danger' verticalAlign='middle' />
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Assigner un numéro à un toponyme'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton
            <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter un numéro</Button>
          </ListItem>
          <ListItem>
            Sélectionnez la voie du numéro que vous souhaitez assigner
          </ListItem>
          <ListItem>
            Un menu déroulant va s’afficher. Vous pouvez sélectionner un ou plusieurs numéros de la liste. Tous les numéros de la liste seront assignés au toponyme si aucun numéro n’est sélectionné.
          </ListItem>
          <ListItem>
            Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Enregistrer</Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Éditer un toponyme'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le nom du toponyme
          </ListItem>
          <ListItem>
            Éditez le nom du toponyme
          </ListItem>
          <ListItem>
            Vous pouvez également modifier la position du toponyme en déplaçant le <MapMarkerIcon icon={MapMarkerIcon} color='info' /> sur la carte
          </ListItem>
          <ListItem>
            Vous pouvez ajouter des positions avec le bouton <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter une position au toponyme</Button>
            ou en supprimer avec le bouton <TrashIcon marginX={6} color='danger' verticalAlign='middle' />
          </ListItem>
          <ListItem>
            Pour terminer, cliquez sur <Button marginX={4} appearance='primary' intent='success'>Enregistrer</Button>
          </ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Supprimer un toponyme'>
        {before}
        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom du toponyme
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

      <Tuto title='Associer des parcelles'>
        {before}

        <OrderedList margin={8}>
          <ListItem>
            Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du toponyme
          </ListItem>
          <ListItem>
            <Pane display='flex' alignItems='center'>
              Dans le menu qui vient d’apparaître, choisissez
              <Menu.Item background='tint1' marginLeft={8} icon={EditIcon}>
                Modifier
              </Menu.Item>
            </Pane>
          </ListItem>
          <ListItem>
            Depuis la carte, cliquez sur la ou les parcelles que vous souhaitez associer au toponyme
          </ListItem>
          <ListItem>
            Pour enregistrer les parcelles, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Enregistrer</Button>
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

      <Problems>
        <Unauthorized title='Je n’arrive pas à ajouter/supprimer un toponyme' />
        <Sidebar />
      </Problems>
    </Pane>
  )
}

export default Toponymes
