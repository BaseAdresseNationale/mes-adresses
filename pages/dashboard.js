import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getContoursCommunes, listBasesLocales} from '../lib/bal-api'
import {expandWithPublished} from '../helpers/bases-locales'

import Map from '../components/dashboard/map'
import StatusVariationChart from '../components/dashboard/status-variation-chart'
import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'
import Header from '../components/header'

const Index = ({basesLocales, contoursCommunes}) => {
  const communeCount = uniq(flattenDeep(
    basesLocales
      .filter(({communes}) => communes.length > 0)
      .map(({communes}) => communes)
  )).length

  return (
    <Pane height='100vh' display='flex' flexDirection='column'>
      <Header />
      <div className='dashboard-container'>
        <Heading size={600} marginY={8} textAlign='center'>
        Tableau de bord des Bases Adresse Locales
        </Heading>

        <Pane display='flex' flexWrap='wrap'>
          <div className='chart-container'>
            <BALCounterChart basesLocales={basesLocales} />
          </div>

          <div className='chart-container map'>
            <Counter label='Communes couvertes par une Base Adresse Locale' value={communeCount} />
            <Pane flexGrow={1} width='100%'>
              <Map basesLocales={basesLocales} contours={contoursCommunes} />
            </Pane>
          </div>
        </Pane>

        <Pane display='flex' flexWrap='wrap'>
          <div className='chart-container'>
            <BALCreationChart basesLocales={basesLocales} />
          </div>

          <div className='chart-container'>
            <StatusVariationChart basesLocales={basesLocales} />
          </div>
        </Pane>
      </div>
      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }
        .chart-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          margin: 1em;
          padding: 1em;
          min-width: 300px;
          max-height: 400px;
          background-color: #fff;
          box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 2px 4px -2px rgba(67, 90, 111, 0.47);
        }

        .chart-container.map {
          flex: 2;
          padding: 0;
        }

        @media (max-width: 380px) {
          .chart-container {
            margin: 0.4em;
            padding: 0.4em;
            min-width: 180px;
          }
        }

      `}</style>
    </Pane>
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
