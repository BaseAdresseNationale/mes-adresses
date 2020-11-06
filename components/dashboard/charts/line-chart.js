import React from 'react'
import PropTypes from 'prop-types'
import {Heading} from 'evergreen-ui'
import {Line} from 'react-chartjs-2'

const LineChart = ({title, data}) => {
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index'
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nombre de BAL'
        }
      }]
    }
  }

  return (
    <div style={{height: '100%', width: '100%'}}>
      {title && (
        <Heading marginBottom={16} textAlign='center'>
          {title}
        </Heading>
      )}
      <Line data={data} options={options} />
    </div>
  )
}

LineChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object.isRequired
}

LineChart.defaultProps = {
  title: null
}

export default LineChart
