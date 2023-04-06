import {useRef} from 'react'
import PropTypes from 'prop-types'
import {Chart} from 'react-chartjs-2'
import {Chart as ChartJS, registerables} from 'chart.js'
import {Pane, Heading} from 'evergreen-ui'

ChartJS.register(...registerables)

function PieChart({title, data, height}) {
  const chartRef = useRef(null)

  const chart = {
    labels: data.map(({label}) => label),
    datasets: [{
      data: data.map(({values}) => values),
      backgroundColor: data.map(({color}) => color)
    }]
  }

  const options = {
    legend: {
      display: true
    }
  }

  return (
    <Pane display='flex' flexDirection='column'>
      {title && (
        <Heading textAlign='center'>
          {title}
        </Heading>
      )}

      <Chart type='pie' ref={chartRef} height={height} data={chart} options={options} />
    </Pane>
  )
}

PieChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
}

PieChart.defaultProps = {
  title: null,
  height: null
}

export default PieChart
