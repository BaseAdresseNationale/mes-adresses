import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Alert, Button, Paragraph, Text} from 'evergreen-ui'

import usePublishProcess from '@/hooks/publish-process'

import BalDataContext from '@/contexts/bal-data'

function HabilitationInfos({commune}) {
  const {habilitation, isHabilitationValid} = useContext(BalDataContext)

  const {
    handleShowHabilitationProcess,
  } = usePublishProcess(commune)

  return (
    <Pane
      backgroundColor='white'
      padding={8}
      borderRadius={10}
      margin={8}
    >
      <Heading marginBottom={15}>Habilitation</Heading>

      {(!habilitation || !isHabilitationValid) ?
        <Alert title="Cette BAL n'est pas habilitée">
          <Text marginTop={5} is='p'>{`Afin d'être synchronisée avec la Base d'Adresse Nationnale, cette Base Adresse Locale doit être habilitée par la commune de ${commune.nom}. Notez qu'une habilitation est valide pendant 6 mois.`}</Text>
          <Button
            appearance='primary'
            onClick={handleShowHabilitationProcess}
          >
            Habiliter la BAL
          </Button>
        </Alert> :
        <Alert intent='success' title='Cette BAL est habilitée'>
          <Paragraph marginTop={5} lineHeight={1.4}>{`Cette Base Adresse Locale détient une habilitation permettant d'alimenter la Base Adresse Nationale pour la commune de ${commune.nom}. Cette habilitation est valide jusqu'au ${new Date(habilitation.expiresAt).toLocaleDateString()}.`}</Paragraph>
        </Alert>}
    </Pane>
  )
}

HabilitationInfos.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
  }).isRequired,
}

export default HabilitationInfos
