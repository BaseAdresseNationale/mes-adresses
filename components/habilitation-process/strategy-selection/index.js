import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Strong, Alert, Text, Heading, PeopleIcon, TimeIcon, LogInIcon, UnorderedList, ListItem} from 'evergreen-ui'

import FranceConnect from '@/components/habilitation-process/strategy-selection/france-connect'
import CodeEmail from '@/components/habilitation-process/strategy-selection/code-email'

const StrategySelection = React.memo(({franceconnectAuthenticationUrl, emailCommune, handleStrategy}) => {
  const [hovered, setHovered] = useState()

  return (
    <Pane marginBottom={-16}>
      <Pane display='flex' flexDirection='column' alignItems='center' justifyContent='center' marginY={16}>
        <Text textAlign='center'>
          Afin de pouvoir publier vos adresses dans la  <Strong size={400}>Base Adresse Nationale</Strong>, votre <Strong size={400}>Base Adresse Locale</Strong> doit obtenir <Strong size={400}>une habilitation</Strong>.
        </Text>

        <Pane display='flex' flexDirection='column' marginTop={16}>
          <Heading textAlign='center' color='#225DF5'>Comprendre l’habilitation en quelques points</Heading>
          <UnorderedList>
            <ListItem icon={PeopleIcon}>
              <Text size={400}>
                Permet à <Strong size={400}>toute personne aillant accès à l’édition</Strong> de cette <Strong size={400}>Base Adresse Locale</Strong> de <Strong size={400}>mettre à jour</Strong> les adresses de sa commune.
              </Text>
            </ListItem>

            <ListItem icon={TimeIcon}>
              <Text size={400}>Elle est valable <Strong size={400}>6 mois</Strong>.</Text>
            </ListItem>

            <ListItem icon={LogInIcon}>
              <Text size={400}>
                Pour l’obtenir, <Strong size={400}>un(e) élu(e)</Strong> de la commune ou <Strong size={400}>un(e) employé(e)</Strong> de la mairie doit <Strong size={400}>s’authentifier</Strong>.
              </Text>
            </ListItem>
          </UnorderedList>
        </Pane>
        <Alert title='Vous n’êtes pas habilité ?' marginTop={16}>
          <Text is='div' marginTop={8}>
            Prestataires et délégataires, contactez la mairie pour qu’elle puisse authentifier les adresses selon les modalités définies ci-dessus.
            Pour rappel, la commune reste responsable de ses adresses, même en cas de délégation de la réalisation technique de l’adressage.
          </Text>
        </Alert>
      </Pane>

      <Pane display='grid' gridTemplateColumns='repeat(auto-fit, minmax(330px, 1fr))' marginX='-32px' padding={16} gap={16} background='gray300' textAlign='center'>
        <Pane
          onMouseEnter={() => setHovered('france-connect')}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === 'france-connect' ? 3 : 0}
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='center'
          background='white'
          padding={16}
          borderRadius={8}
          height={415}
          flex={1}
        >
          <FranceConnect handleStrategy={() => handleStrategy('france-connect')} isDisabled={!franceconnectAuthenticationUrl} />
        </Pane>

        <Pane
          onMouseEnter={() => setHovered('email')}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === 'email' ? 3 : 0}
          display='flex'
          flexDirection='column'
          alignItems='center'
          background='white'
          padding={16}
          borderRadius={8}
          height={415}
          flex={1}
        >
          <CodeEmail emailCommune={emailCommune} handleStrategy={() => handleStrategy('email')} />
        </Pane>
      </Pane>
    </Pane>
  )
})

StrategySelection.defaultProps = {
  franceconnectAuthenticationUrl: null,
  emailCommune: null
}

StrategySelection.propTypes = {
  franceconnectAuthenticationUrl: PropTypes.string,
  emailCommune: PropTypes.string,
  handleStrategy: PropTypes.func.isRequired
}

export default StrategySelection
