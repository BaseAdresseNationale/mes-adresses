import {Pane, OrderedList, ListItem, Button, Strong, Paragraph, Tab, CogIcon, PlusIcon} from 'evergreen-ui'

import BALRecovery from '../../bal-recovery/bal-recovery'

import Tuto from '../tuto'
import Unauthorized from '../tuto/unauthorized'

import Problems from './problems'

function BaseLocale() {
  return (
    <Pane>
      <Tuto title='Créer une nouvelle Base Adresse Locale'>
        <Paragraph marginTop='default'>
          Sur la page <b>Nouvelle Base Adresse Locale</b>, sélectionnez l’onglet <Tab isSelected>Créer</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>Indiquez le nom de votre Base Adresse Locale dans le champ <Strong size={500} fontStyle='italic'>Nom</Strong>. Il vous permettra de pouvoir identifier votre Base Adresse Locale.</ListItem>
          <ListItem>Indiquez l’adresse email de votre mairie ou de l’administrateur de la Base Adresse Locale. C’est cette adresse qui recevra le lien permettant d’accèder à l’édition de votre Base Adresse Locale.</ListItem>
          <ListItem>Recherchez votre commune puis sélectionnez la dans la liste des suggestions.</ListItem>
          <ListItem>Si vous souhaitez partir de zéro, décochez la case <Strong size={500} fontStyle='italic'>Importer les voies et numéros depuis la BAN</Strong>.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={PlusIcon}>Créer la Base Adresse Locale</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Importer une Base Adresse Locale'>
        <Paragraph marginTop='default'>
          Sur la page <b>Nouvelle Base Adresse Locale</b>, sélectionnez l’onglet <Tab isSelected>Importer un fichier CSV</Tab>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>Sélectionnez ou déposez votre fichier au format <b>csv</b>. Attention ce fichier ne doit pas dépasser 10 Mo.</ListItem>
          <ListItem>Indiquez le nom de votre Base Adresse Locale dans le champ <Strong size={500} fontStyle='italic'>Nom</Strong>. Il vous permettra de pouvoir identifier votre Base Adresse Locale.</ListItem>
          <ListItem>Indiquez l’adresse email de votre mairie ou de l’administrateur de la Base Adresse Locale. C’est cette adresse qui recevra le lien permettant d’accèder à l’édition de votre Base Adresse Locale.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success' iconAfter={PlusIcon}>Créer la Base Adresse Locale</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Administrer votre Base Adresse Locale'>
        <Paragraph marginTop='default'>
          Accédez aux paramètres de votre Base Adresse Locale en cliquant sur l’icône <span><CogIcon marginX={4} icon={CogIcon} /></span> située en haut à droite de votre écran.
          Puis choissez «Paramètres».
        </Paragraph>
        <Paragraph marginTop='default'>
          Il vous sera possible de :
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>Changer le nom de votre Base Adresse Locale</ListItem>
          <ListItem>Ajouter ou supprimer des collaborateurs</ListItem>
          <ListItem>Télécharger vos adresses au format .csv</ListItem>
        </OrderedList>

        <Paragraph marginTop='default'>
          Une fois vos réglages terminés, cliquez sur <Button marginX={4} appearance='primary'>Enregistrer les changements</Button>
        </Paragraph>
      </Tuto>

      <Problems>
        <Unauthorized title='Je n’arrive pas à éditer ma BAL' />

        <Tuto title='Je ne trouve pas ma commune'>
          <Paragraph marginTop='default'>
            Si votre commune est une nouvelle commune issue d’une fusion, alors il est possible qu’elle n’apparaisse pas dans la liste des propositions.
            Si c’est votre cas, vous pouvez nous contacter sur <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>
          </Paragraph>
        </Tuto>

        <BALRecovery />
      </Problems>
    </Pane>
  )
}

export default BaseLocale
