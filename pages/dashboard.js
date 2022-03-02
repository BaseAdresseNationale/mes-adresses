import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getBasesLocalesStats, listBasesLocales} from '../lib/bal-api'

import DashboardLayout from '../components/layout/dashboard'

import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'
import Redirection from './dashboard/redirection'
import PublishedBalStats from '../components/dashboard/published-bal-stats'

function Index({basesLocales, basesLoclesStats}) {
  const communeCount = uniq(flattenDeep(
    basesLocales
      .filter(({communes}) => communes.length > 0)
      .map(({communes}) => communes)
  )).length

  return (
    <DashboardLayout title='Tableau de bord de l&apos;éditeur Mes Adresses' mapData={{basesLocales}}>
      <Pane display='grid' gridGap='2em' padding={5}>
        <PublishedBalStats stats={basesLoclesStats} />

        <Counter label='Communes couvertes par une Base Adresse Locale' value={communeCount} />

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
  const basesLocalesWithoutDemo = basesLocales.filter((b => b.status !== 'demo'))

  return {
    basesLocales: basesLocalesWithoutDemo,
    basesLoclesStats,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  basesLoclesStats: PropTypes.object.isRequired
}

export default Index
