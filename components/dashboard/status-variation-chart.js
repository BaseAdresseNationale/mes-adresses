import React from 'react'
import {groupBy, sortBy} from 'lodash'
import PropTypes from 'prop-types'
import {subMonths, lastDayOfMonth, format, formatISO} from 'date-fns'

import {colors} from '../../lib/colors'
import {filterByStatus} from '../../lib/bases-locales'

import LineChart from './charts/line-chart'

const LAST_MONTH = subMonths(new Date(), 1)
const LAST_DAY_OF_THE_MONTH = lastDayOfMonth(LAST_MONTH)

const excludeCurrentMonth = basesLocales => {
  return basesLocales.filter(({_updated}) => {
    return new Date(_updated) < LAST_DAY_OF_THE_MONTH
  })
}

const StatusVariationChart = ({basesLocales}) => {
  const BALWithoutCurrentMonth = excludeCurrentMonth(basesLocales)
  const orderedBalByUpdate = sortBy(BALWithoutCurrentMonth, '_updated')
  const groupedByUpdate = Object.values(groupBy(orderedBalByUpdate, ({_updated}) => {
    return format(new Date(_updated), 'yyyy-MM')
  }))

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
    labels: groupedByUpdate.map(data => {
      return formatISO(new Date(data[0]._updated), {representation: 'date'})
    }),
    datasets
  }

  return (
    <LineChart title='Bases Adresse Locales mises à jour' data={data} />
  )
}

StatusVariationChart.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default StatusVariationChart
