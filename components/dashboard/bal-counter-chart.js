import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {getBALByStatus} from '../../lib/bases-locales'

import Counter from './counter'
import PieChart from './charts/pie-chart'

const BALCounterChart = ({basesLocales}) => {
  const BALByStatus = getBALByStatus(basesLocales)

  return (
    <Pane display='flex' flexDirection='column' alignItems='center' >
      <Counter label='Bases Adresse locales' value={basesLocales.length} />
      <PieChart height={240} data={BALByStatus} />
    </Pane>
  )
}

BALCounterChart.propTypes = {
  basesLocales: PropTypes.array.isRequired,
}

export default BALCounterChart
