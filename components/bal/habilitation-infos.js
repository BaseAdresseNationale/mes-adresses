import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Alert, Button, Paragraph, Text} from 'evergreen-ui'

import usePublish from '@/hooks/publish'

import BalDataContext from '@/contexts/bal-data'

function HabilitationInfos({commune}) {
  const {habilitation, isHabilitationValid} = useContext(BalDataContext)

  const {
    handleHabilitation,
  } = usePublish(commune)

  return (
    <Pane
      backgroundColor='white'
      padding={8}
      borderRadius={10}
      margin={8}
    >
      <Heading marginBottom={15}>Habilitation</Heading>

      {(!habilitation || !isHabilitationValid) ?
        <Alert title="Vous n'êtes pas habilité">
          <Text is='p'>Afin de pouvoir publier la Base Adresse Locale vous devez avoir une habilitation valide.</Text>
          <Button
            appearance='primary'
            onClick={handleHabilitation}
          >
            Je veux m&apos;habiliter
          </Button>
        </Alert> :
        <Alert intent='success' title='Vous êtes habilité'>
          <Paragraph>{`Vous détenez une habilitation vous permettant de publier la Base Adresse Locale jusqu'au ${new Date(habilitation.expiresAt).toLocaleDateString()}.`}</Paragraph>
        </Alert>}
    </Pane>
  )
}

HabilitationInfos.propTypes = {
  commune: PropTypes.shape({
    isCOM: PropTypes.bool.isRequired,
  }).isRequired,
}

export default HabilitationInfos
