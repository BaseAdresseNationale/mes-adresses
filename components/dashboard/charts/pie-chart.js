import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2'
import {Pane, Heading} from 'evergreen-ui'

const PieChart = ({title, data, height}) => {
  const chartRef = useRef(null)

  const chart = {
    labels: data.map(({label}) => label),
    datasets: [
      {
        data: data.map(({values}) => values),
        backgroundColor: data.map(({color}) => color)
      }
    ]
  }

  const options = {
    legend: {
      display: true
    }
  }

  return (
    <Pane display='flex' flexDirection='column'>
      {title && <Heading textAlign='center'>{title}</Heading>}

      <Pie ref={chartRef} height={height} data={chart} options={options} />
    </Pane>
  )
}

PieChart.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  data: PropTypes.array.isRequired
}

PieChart.defaultProps = {
  title: null,
  height: null
}

export default PieChart
