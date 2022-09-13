import {useRouter} from 'next/router'
import Image from 'next/image'

import {Pane, Heading, Paragraph, Text, Strong, UnorderedList, ListItem, DeleteIcon, Button, EnvelopeIcon, Link} from 'evergreen-ui'

function Accessibilite() {
  const router = useRouter()
  return (
    <Pane display='flex' flexDirection='column' alignItems='center' gap='4em' marginX='6em' marginTop='2em' fontSize={14}>
      <Pane width='100%' maxWidth={500} textAlign='center'>
        <Image src='/static/images/accessibilite-illustration.svg' layout='responsive' height={100} width={500} alt='true' />
      </Pane>

      <Pane gap='1em' display='flex' flexDirection='column' alignItems='center'>
        <Heading is='h2' size={900} color='#2952CC'>Déclaration d’accessibilité</Heading>
        <Pane display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
          <Pane>
            <Paragraph lineHeight='200%'><Strong>La Base Adresse Nationale</Strong> s’engage à rendre ses sites internet, intranet, extranet et ses progiciels accessibles (et ses applications mobiles et mobilier urbain numérique) conformément à l’article 47 de <Strong>la loi n°2005-102 du 11 février 2005</Strong>. À cette fin, elle met en œuvre la stratégie et les actions suivantes :</Paragraph>
            <UnorderedList>
              <ListItem>Fournir un site web accessible.</ListItem>
              <ListItem>Prêter attention aux informations d’accessibilité des données.</ListItem>
            </UnorderedList>
          </Pane>

          <Pane width='fit-content' padding='1em' background='#EBF0FF' border='solid 3px #2952CC' borderRadius={5} marginTop={20}>
            <Text fontSize={16}>Cette déclaration d’accessibilité a été établie le <Strong>01/08/2022</Strong> et s’applique à <Strong>mes-adresses.data.gouv</Strong></Text>
          </Pane>
        </Pane>
      </Pane>

      <Pane display='flex' flexDirection='column' alignItems='center' gap='1em'>
        <Heading is='h3' size={800} color='#2952CC'>État de conformité</Heading>
        <Pane padding='2em' background='#FDF4F4' border='solid 3px #D14343' borderRadius={5} textAlign='center'>
          <Text
            color='#D14343'
            fontSize={22}
            fontWeight={600}
            display='flex'
            alignItems='center'
            textAlign='center'
            justifyContent='center'
          >
            <DeleteIcon size={22} marginRight={8} />Non-conforme
          </Text>
        </Pane>
        <Paragraph lineHeight='200%'><Strong>mes-adresses.data.gouv</Strong> est non-conforme avec le <Strong>référentiel général d’amélioration de l’accessibilité</Strong> (RGAA), un audit d’accessibilité n’ayant pas encore été réalisé. L’absence d’audit d’accessibilité ne remet pas en cause <Strong>le caractère accessible</Strong> du site web actuel.</Paragraph>
      </Pane>

      <Pane width='100%' display='flex' flexDirection='column' alignItems='center' gap='1em'>
        <Heading is='h3' size={800} color='#2952CC'>Information et contact</Heading>
        <Paragraph width='100%' lineHeight='200%'>Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter notre équipe pour être orienté vers une alternative accessible ou obtenir le contenu sous une autre forme.</Paragraph>
        <Button
          onClick={() => router.push('mailto:adresse@data.gouv.fr')}
          appearance='primary'
          iconBefore={EnvelopeIcon}
        >
          Nous contacter
        </Button>
      </Pane>

      <Pane width='100%' display='flex' flexDirection='column' alignItems='center' gap='1em' marginBottom='2em'>
        <Heading is='h3' size={800} color='#2952CC'>Voie de recours</Heading>
        <Pane>
          <Paragraph>Si vous constatez un <Strong>défaut d’accessibilité</Strong> vous empêchant d’accéder à un contenu ou une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au <Strong>Défenseur des droits</Strong>.<br />
            Plusieurs moyens sont à votre disposition :
          </Paragraph>
          <UnorderedList>
            <ListItem>
              <Link href='https://formulaire.defenseurdesdroits.fr' textDecoration='underline' color='neutral' target='_blank'>
                Écrire un message au <Strong>Défenseur des droits</Strong>.
              </Link>
            </ListItem>
            <ListItem>
              <Link href='https://www.defenseurdesdroits.fr/saisir/delegues' textDecoration='underline' color='neutral' target='_blank'>
                Contacter <Strong>le délégué du Défenseur des droits</Strong></Link> dans votre région.
            </ListItem>
            <ListItem>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre).<br />
              <Strong>
                Défenseur des droits<br />
                Libre réponse 71120<br />
                75342 Paris CEDEX 07
              </Strong>
            </ListItem>
          </UnorderedList>
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Accessibilite
