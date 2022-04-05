import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {getBALByStatus} from '@/lib/bases-locales'

import Counter from '@/components/dashboard/counter'
import PieChart from '@/components/dashboard/charts/pie-chart'

function BALCounterChart({basesLocalesStatsByStatus, nbBasesLocales}) {
  const BALByStatus = getBALByStatus(basesLocalesStatsByStatus)

  return (
    <Pane display='flex' flexDirection='column' alignItems='center' >
      <Counter label='Bases Adresse locales' value={nbBasesLocales} />
      <PieChart height={240} data={BALByStatus} />
    </Pane>
  )
}

BALCounterChart.propTypes = {
  basesLocalesStatsByStatus: PropTypes.object.isRequired,
  nbBasesLocales: PropTypes.number.isRequired
}

export default BALCounterChart
