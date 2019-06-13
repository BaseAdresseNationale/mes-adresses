import React from 'react'
import {Pane, OrderedList, ListItem, Button, Paragraph, Tablist, Tab} from 'evergreen-ui'

import Tuto from './tuto'
import Problems from './problems'

const BaseLocale = () => {
  return (
    <Pane>
      <Tuto title='Créer une nouvelle Base Adresse Locale'>
        <Paragraph marginTop='default'>
          Sur la page <b>Nouvelle Base Adresse Locale</b>, sélectionnez l’onglet <Tablist><Tab isSelected>Créer</Tab></Tablist>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>Indiquez le nom de votre Base Adresse Locale dans le champ <b>"Nom"</b>. Il vous permettra de pouvoir identifier votre Base Adresse Locale.</ListItem>
          <ListItem>Indiquez l’adresse email de votre mairie ou de l’administrateur de la Base Adresse Locale. C’est cette adresse qui recevra le lien permettant d’accèder à l’édition de votre Base Adresse Locale.</ListItem>
          <ListItem>Recherche votre commune puis sélectionnez la dans la liste des suggestions.</ListItem>
          <ListItem>Si vous souhaitez partir de zéro, décochez la case <b>"Importer les voies et numéros depuis la BAN"</b>.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button appearance='primary'>Créer la Base Adresse Locale</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Tuto title='Importer une Base Adresse Locale'>
        <Paragraph marginTop='default'>
          Sur la page <b>Nouvelle Base Adresse Locale</b>, sélectionnez l’onglet <Tablist><Tab isSelected>Importer un fichier CSV</Tab></Tablist>
        </Paragraph>
        <OrderedList margin={8}>
          <ListItem>Sélectionnez ou déposez votre fichier au format <b>csv</b>. Attention ce fichier ne doit pas dépasser 100 Mo.</ListItem>
          <ListItem>Indiquez le nom de votre Base Adresse Locale dans le champ <b>"Nom"</b>. Il vous permettra de pouvoir identifier votre Base Adresse Locale.</ListItem>
          <ListItem>Indiquez l’adresse email de votre mairie ou de l’administrateur de la Base Adresse Locale. C’est cette adresse qui recevra le lien permettant d’accèder à l’édition de votre Base Adresse Locale.</ListItem>
          <ListItem>Pour terminer, cliquez sur le bouton <Button appearance='primary'>Créer la Base Adresse Locale</Button></ListItem>
        </OrderedList>
      </Tuto>

      <Problems>
        <Tuto title='Je n’arrive pas à éditer ma BAL'>
          <Paragraph marginTop='default'>
            Assurez vous que
            <Button
              height={24}
              margin={8}
              appearance='primary'
              intent='danger'
              iconBefore='edit'
            >
              Édition impossible
            </Button>
            n’apparaisse pas en haut de votre écran.
          </Paragraph>
          <Paragraph marginTop='default'>
            Il indique que vous n’êtes pas authentifié ou que vous n’avez pas les droits pour modifier cette BAL.
          </Paragraph>
          <Paragraph marginTop='default'>
            Si cependant, vous en êtes bien le propriétaire alors il vous suffit de cliquer sur le lien qui vous a été envoyé par mail lors de la création de votre BAL.
          </Paragraph>
        </Tuto>

        <Tuto title='Je ne trouve pas ma commune'>
          <Paragraph marginTop='default'>
            Si votre commune est une commune nouvelle issue d’une fusion, alors il est possible qu’elle n’apparaisse pas dans la liste des propositions.
            Si c’est votre cas, vous pouvez nous contactez nous sur <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>
          </Paragraph>
        </Tuto>
      </Problems>
    </Pane>
  )
}

export default BaseLocale
