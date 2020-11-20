import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getContoursCommunes, listBasesLocales} from '../lib/bal-api'
import {expandWithPublished} from '../helpers/bases-locales'

import DashboardLayout from '../components/layout/dashboard'

import StatusVariationChart from '../components/dashboard/status-variation-chart'
import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'

const Index = ({basesLocales, contoursCommunes}) => {
  const communeCount = uniq(flattenDeep(
    basesLocales
      .filter(({communes}) => communes.length > 0)
      .map(({communes}) => communes)
  )).length

  return (
    <DashboardLayout title='Tableau de bord des Bases Adresse Locales' mapData={{basesLocales, contours: contoursCommunes}}>
      <Pane display='grid' gridGap='2em' padding={8}>
        <Counter label='Communes couvertes par une Base Adresse Locale' value={communeCount} />
        <BALCounterChart basesLocales={basesLocales} />
        <BALCreationChart basesLocales={basesLocales} />
        <StatusVariationChart basesLocales={basesLocales} />
      </Pane>
    </DashboardLayout>
  )
}

Index.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  const contoursCommunes = await getContoursCommunes()
  const basesLocalesWithoutTest = basesLocales.filter((({isTest}) => !isTest))
  await expandWithPublished(basesLocalesWithoutTest)

  return {
    basesLocales: basesLocalesWithoutTest,
    contoursCommunes,
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Index
