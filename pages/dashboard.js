import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getContoursCommunes, getPublishedIds, listBasesLocales, setIfPublished} from '../lib/bal-api'

import DashboardLayout from '../components/layout/dashboard'

import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'
import Redirection from './dashboard/redirection'

const Index = ({basesLocales, contoursCommunes}) => {
  const communeCount = uniq(flattenDeep(
    basesLocales
      .filter(({communes}) => communes.length > 0)
      .map(({communes}) => communes)
  )).length

  return (
    <DashboardLayout title='Tableau de bord de l&apos;éditeur Mes Adresses' mapData={{basesLocales, contours: contoursCommunes}}>
      <Pane display='grid' gridGap='2em' padding={5}>
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
  const contoursCommunes = await getContoursCommunes()
  const basesLocalesWithoutDemo = basesLocales.filter((b => b.status !== 'demo'))
  const publishedBalIds = await getPublishedIds()

  for (const bal of basesLocalesWithoutDemo) {
    setIfPublished(bal, publishedBalIds)
  }

  return {
    basesLocales: basesLocalesWithoutDemo,
    contoursCommunes,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Index
