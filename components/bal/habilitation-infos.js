import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Alert, Button, Text} from 'evergreen-ui'

import usePublishProcess from '@/hooks/publish-process'

import BalDataContext from '@/contexts/bal-data'
import HabilitationTag from '../habilitation-tag'

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
        <Alert hasIcon={false} title={<Pane display='flex' alignItems='center'>
          <HabilitationTag communeName={commune.nom} isHabilitationValid={isHabilitationValid} />
          <span style={{marginLeft: 5}}>Cette Base Adresse Locale n&apos;est pas habilitée</span>
        </Pane>}
        >
          <Text marginTop={5} is='p'>{`Afin d'être synchronisée avec la Base d'Adresse Nationnale, cette Base Adresse Locale doit être habilitée par la commune de ${commune.nom}. Notez qu'une habilitation est valide pendant 6 mois.`}</Text>
          <Button
            appearance='primary'
            onClick={handleShowHabilitationProcess}
          >
            Habiliter la Base Adresse Locale
          </Button>
        </Alert> :
        <Alert hasIcon={false} intent='success' title={<Pane display='flex' alignItems='center'>
          <HabilitationTag communeName={commune.nom} isHabilitationValid={isHabilitationValid} />
          <span style={{marginLeft: 5}}>Cette Base Adresse Locale est habilitée</span>
        </Pane>}
        >
          <Text marginTop={5} is='p'>Cette Base Adresse Locale détient une habilitation permettant d&apos;alimenter la Base Adresse Nationale pour la commune de {commune.nom}. Cette habilitation est valide jusqu&apos;au <b>{new Date(habilitation.expiresAt).toLocaleDateString()}</b>.</Text>
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
