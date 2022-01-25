import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'

import Counter from './counter'

function PublishedBalStats({stats}) {
  const {nbVoies, nbLieuxDits, nbNumeros, nbNumerosCertifies} = stats

  return (
    <Pane>
      <Heading size={500} color='muted' fontWeight={300} textAlign='center'>Chiffres des Bases Adresses Locales publiées</Heading>
      <Pane display='grid' gridTemplateColumns='repeat(4, 1fr)'>
        <Counter label={nbVoies > 1 ? 'Voies' : 'Voie'} value={nbVoies} />
        <Counter label={nbLieuxDits > 1 ? 'Lieux-dits' : 'Lieu-dit'} value={nbLieuxDits} />
        <Counter label={nbNumeros > 1 ? 'Adresses' : 'Adresse'} value={nbNumerosCertifies} />
        <Counter label={nbNumerosCertifies > 1 ? 'Adresses certifiées' : 'Adresse certifiée'} value={nbNumerosCertifies} />
      </Pane>
    </Pane>

  )
}

PublishedBalStats.propTypes = {
  stats: PropTypes.object.isRequired
}

export default PublishedBalStats
