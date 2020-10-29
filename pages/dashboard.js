import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'
import {uniq, flattenDeep} from 'lodash'

import {getContoursCommunes, listBasesLocales} from '../lib/bal-api'
import {formatDateYYYYMMDD} from '../lib/date'
import {expandWithPublished} from '../helpers/bases-locales'

import Map from '../components/dashboard/map'
import StatusVariationChart from '../components/dashboard/status-variation-chart'
import BALCreationChart from '../components/dashboard/bal-creation-chart'
import BALCounterChart from '../components/dashboard/bal-counter-chart'
import Counter from '../components/dashboard/counter'

const Index = ({basesLocales, contoursCommunes}) => {
  const communeCount = () => {
    return uniq(flattenDeep(basesLocales.filter(({communes}) => communes.length > 0).map(({communes}) => communes))).length
  }

  return (
    <div className='index-container'>
      <Heading size={600} marginY={8} textAlign='center'>
        Tableau de bord des Bases Adresse Locales
      </Heading>

      <Counter
        label='Communes couvertes par une Base Adresse Locale'
        value={communeCount()}
        size={30}
      />

      <div className='pie-creation-charts-container'>
        <div>
          <BALCounterChart basesLocales={basesLocales} />
        </div>
        <div>
          <BALCreationChart basesLocales={basesLocales} />
        </div>
      </div>

      <div className='charts-map-container'>
        <div className='chart-bal-creation-container'>
          <StatusVariationChart basesLocales={basesLocales} />
        </div>
        <Pane width='100%' elevation={1} border='default'>
          <Map basesLocales={basesLocales} contours={contoursCommunes} />
        </Pane>
      </div>

      <style jsx>{`
        .index-container {
          padding: 0 16px;
          overflow-y: auto;
        }

        .pie-creation-charts-container {
          display: flex;
          justify-content: space-between;  
        }

        .chart-bal-creation-container {
          margin-right: 10px;
        }

        .charts-map-container {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        @media screen and (max-width: 960px) {
          .index-container {
            padding: 0;
          }

          .chart-bal-container {
            margin: 0;
          }

          .chart-bal-container, .charts-map-container, .chart-bal-creation-container {
            margin-bottom: 10px;
          }

          .chart-bal-creation-container {
            margin-right: 0;
          }

          .charts-map-container {
            flex-direction: column;
          }

        }
      `}</style>
    </div>
  )
}

Index.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  const contoursCommunes = await getContoursCommunes()
  const basesLocalesWithoutTest = basesLocales.filter((({isTest}) => !isTest))
  await expandWithPublished(basesLocalesWithoutTest)

  const datedBaseLocales = basesLocalesWithoutTest.map(baseLocale => {
    const {_created, _updated} = baseLocale
    const day = formatDateYYYYMMDD(_created)
    const [year, monthNumber] = day.split('-')
    const month = `${year}-${monthNumber}`

    const updatedDay = formatDateYYYYMMDD(_updated)
    const [updatedYear, updatedMonthNumber] = updatedDay.split('-')
    const updatedMonth = `${updatedYear}-${updatedMonthNumber}`

    return {...baseLocale, day, year, month, updatedDay, updatedMonth, updatedYear}
  })

  return {
    basesLocales: datedBaseLocales,
    contoursCommunes
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Index
