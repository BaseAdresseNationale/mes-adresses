import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {getBALByStatus} from '../../lib/bases-locales'

import Counter from './counter'
import PieChart from './charts/pie-chart'

const BALCounterChart = ({basesLocales}) => {
  const BALByStatus = getBALByStatus(basesLocales)

  return (
    <div className='chart-container'>
      <Pane elevation={1} border='default'>
        <Counter
          label='Bases Adresse locales'
          value={basesLocales.length}
          size={30}
        />
        <div className='chart'>
          <PieChart height={150} data={BALByStatus} />
        </div>
      </Pane>
      <style jsx>{`
      .chart-container {
          width: 40vw;
        }

        .chart{
          position: relative;
        }  
      `}</style>
    </div>
  )
}

BALCounterChart.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default BALCounterChart
