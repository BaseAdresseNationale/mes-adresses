import {useCallback} from 'react'
import PropTypes from 'prop-types'
import {groupBy} from 'lodash'
import {format, formatISO} from 'date-fns'

import {colors} from '../../lib/colors'
import {filterByStatus} from '../../lib/bases-locales'

import BarChart from './charts/bar-chart'

function BALCreationChart({basesLocales}) {
  const groupedByMonth = Object.values(groupBy(basesLocales, ({_created}) => format(new Date(_created), 'yyyy-MM')))

  const sumByStatus = useCallback(status => {
    const sums = []

    const filteredByStatus = groupedByMonth.map(basesLocales => filterByStatus(basesLocales, status).length)

    if (filteredByStatus.length > 0) {
      const addedBal = filteredByStatus.reduce((totalValue, currentValue) => {
        sums.push(totalValue)
        const sum = totalValue + currentValue
        return sum
      })
      sums.push(addedBal)
    }

    return sums
  }, [groupedByMonth])

  const datasets = [
    {
      label: 'Publiées',
      data: sumByStatus('published'),
      backgroundColor: colors.green,
    },
    {
      label: 'Prêtes à être publiées',
      data: sumByStatus('ready-to-publish'),
      backgroundColor: colors.blue,
    },
    {
      label: 'Brouillons',
      data: sumByStatus('draft'),
      backgroundColor: colors.neutral,
    },
  ]

  const data = {
    labels: groupedByMonth.map(data => formatISO(new Date(data[0]._created), {representation: 'date'})),
    datasets,
  }

  return (
    <BarChart title='Évolution du nombre de Bases Adresses Locales' data={data} />
  )
}

BALCreationChart.propTypes = {
  basesLocales: PropTypes.array.isRequired,
}

export default BALCreationChart
