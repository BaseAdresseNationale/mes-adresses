import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'

import Counter from '@/components/dashboard/counter'

function PublishedBalStats({stats}) {
  const {nbCommunes, nbVoies, nbLieuxDits, nbNumeros, nbNumerosCertifies} = stats

  return (
    <Pane marginTop={16}>
      <Heading size={500} color='muted' fontWeight={300} textAlign='center'>Chiffres des Bases Adresses Locales publiées</Heading>
      <Pane display='grid' gridTemplateColumns='repeat(3, 1fr)'>
        <Counter label={nbCommunes > 1 ? 'Communes' : 'Commune'} value={nbCommunes} />
        <Counter label={nbVoies > 1 ? 'Voies' : 'Voie'} value={nbVoies} />
        <Counter label={nbLieuxDits > 1 ? 'Lieux-dits' : 'Lieu-dit'} value={nbLieuxDits} />
        <Counter label={nbNumeros > 1 ? 'Adresses' : 'Adresse'} value={nbNumeros} />
        <Counter label={nbNumerosCertifies > 1 ? 'Adresses certifiées' : 'Adresse certifiée'} value={nbNumerosCertifies} />
      </Pane>
    </Pane>

  )
}

PublishedBalStats.propTypes = {
  stats: PropTypes.object.isRequired
}

export default PublishedBalStats
