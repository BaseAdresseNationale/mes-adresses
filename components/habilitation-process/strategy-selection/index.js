import React, {useState} from 'react'
import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Strong, Alert, Text} from 'evergreen-ui'

import FranceConnect from './france-connect'
import CodeEmail from './code-email'

const StrategySelection = React.memo(({franceconnectAuthenticationUrl, emailCommune, handleStrategy}) => {
  const [hovered, setHovered] = useState()

  return (
    <Pane>
      <Pane display='flex' flexDirection='row' alignItems='center' justifyContent='center' marginY={16}>
        <Pane marginRight={32}>
          <NextImage
            src='/static/images/bal-logo.png'
            alt='Logo Base Adresse Locale'
            width={120} height={120}
          />
        </Pane>

        <Pane display='flex' flexDirection='column'>
          <Text marginTop={8} size={400}>
            Afin de pouvoir publier vos adresses dans la Base Adresses Nationale, votre Base Adresses Locale doit obtenir <Strong size={400}>une habilitation</Strong>.
          </Text>
          <Text marginTop={8} size={400}>
            Cette habilitation, valable pendant <Strong size={400}>6 mois</Strong>, permettra à <Strong size={400} textDecoration='underline'>toutes personnes aillant accès à l’édition de cette Base Adresse Locale</Strong>, de mettre à jour les adresses de la commune dans la Base Adresses Nationale.
          </Text>
          <Text marginTop={8} size={400}>
            Pour obtenir une habilitation pour votre Base Adresses Locale, <Strong size={400}>un élu de la commune</Strong> ou <Strong size={400}>un employé de mairie</Strong> doit s’authentifier grâce à l’une des deux méthodes suivantes :
          </Text>
        </Pane>
      </Pane>

      <Pane display='grid' gridTemplateColumns='1fr 1fr' marginX='-32px' padding={16} gap={16} background='gray300' textAlign='center'>
        <Pane
          onMouseEnter={() => setHovered('france-connect')}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === 'france-connect' ? 3 : 0}
          display='flex'
          flexDirection='column'
          alignItems='center'
          background='white'
          padding={16}
          borderRadius={8}
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
        >
          <CodeEmail emailCommune={emailCommune} handleStrategy={() => handleStrategy('email')} />
        </Pane>
      </Pane>

      <Alert title='Vous n’êtes pas habilité' marginTop={16}>
        <Text is='div' marginTop={8}>
          Prestataires et délégataires, contactez la mairie pour qu’elle puisse authentifier les adresses selon les modalités définies ci-dessus.
          Pour rappel, la commune reste responsable de ses adresses, même en cas de délégation de la réalisation technique de l’adressage.
        </Text>
      </Alert>
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
