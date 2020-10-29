import React from 'react'
import {groupBy, sortBy} from 'lodash'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {colors} from '../../lib/colors'
import {formatDateYYYYMMDD} from '../../lib/date'
import {filterByStatus} from '../../lib/bases-locales'

import LineChart from './charts/line-chart'

const CURRENT_DAY = formatDateYYYYMMDD()
const [CURRENT_YEAR, CURRENT_MONTH] = CURRENT_DAY.split('-')

const excludeCurrentMonth = basesLocales => {
  return basesLocales.filter(({updatedMonth}) => {
    return updatedMonth !== `${CURRENT_YEAR}-${CURRENT_MONTH}`
  })
}

const StatusVariationChart = ({basesLocales}) => {
  const BALWithoutCurrentMonth = excludeCurrentMonth(basesLocales)
  const orderedBalByUpdate = sortBy(BALWithoutCurrentMonth, '_updated')
  const groupedByUpdate = Object.values(groupBy(orderedBalByUpdate, 'updatedMonth'))

  const datasets = [
    {
      label: 'Publiées',
      data: groupedByUpdate.map(basesLocales => filterByStatus(basesLocales, 'published').length),
      borderColor: colors.green,
      backgroundColor: colors.green,
      fill: false
    },
    {
      label: 'Prêtes à être publiées',
      data: groupedByUpdate.map(basesLocales => filterByStatus(basesLocales, 'ready-to-publish').length),
      borderColor: colors.blue,
      backgroundColor: colors.blue,
      fill: false
    }
  ]

  const data = {
    labels: groupedByUpdate.map(data => data[0].updatedDay),
    datasets
  }

  return (
    <div className='chart-container'>
      <Pane padding={8} elevation={1} border='default'>
        <div className='chart'>
          <LineChart
            title='Bases Adresse Locales mises à jour'
            height={300}
            data={data} />
        </div>
      </Pane>
      <style jsx>{`
        .chart-container {
          width: 50vw;
        }

        .chart{
          position: relative;
        }

        @media screen and (max-width: 960px) {
          .chart-container {
            width: 100%;
          }
        }
        `}</style>
    </div>
  )
}

StatusVariationChart.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default StatusVariationChart
