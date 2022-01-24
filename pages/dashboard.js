import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getBasesLocalesStats, getContoursCommunes, listBasesLocales} from '../lib/bal-api'

import DashboardLayout from '../components/layout/dashboard'

import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'
import Redirection from './dashboard/redirection'

function Index({basesLocales, basesLoclesStats, contoursCommunes}) {
  const communeCount = uniq(flattenDeep(
    basesLocales
      .filter(({communes}) => communes.length > 0)
      .map(({communes}) => communes)
  )).length

  return (
    <DashboardLayout title='Tableau de bord de l&apos;éditeur Mes Adresses' mapData={{basesLocales, contours: contoursCommunes}}>
      <Pane display='grid' gridGap='2em' padding={5}>
        <Counter label='Communes couvertes par une Base Adresse Locale' value={communeCount} />
        <Pane>
          <Heading size={500} color='muted' fontWeight={300} textAlign='center'>Chiffres des Bases Adresses Locales publiées</Heading>
          <Pane display='grid' gridTemplateColumns='repeat(3, 1fr)'>
            <Counter label='Voies' value={basesLoclesStats.nbVoies} />
            <Counter label='Lieux-dits' value={basesLoclesStats.nbLieuxDits} />
            <Counter label='Adresses certifiées' value={basesLoclesStats.nbNumerosCertifies} />
          </Pane>
        </Pane>
        <BALCounterChart basesLocales={basesLocales} />
        <BALCreationChart basesLocales={basesLocales} />
        <Redirection />
      </Pane>
    </DashboardLayout>
  )
}

Index.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  const basesLoclesStats = await getBasesLocalesStats()
  const contoursCommunes = await getContoursCommunes()
  const basesLocalesWithoutDemo = basesLocales.filter((b => b.status !== 'demo'))

  return {
    basesLocales: basesLocalesWithoutDemo,
    basesLoclesStats,
    contoursCommunes,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  basesLoclesStats: PropTypes.object.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Index
