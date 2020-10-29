import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {Line} from 'react-chartjs-2'

const LineChart = ({title, height, data}) => {
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
    <div className='chart-container'>
      <Pane padding={8} elevation={1} border='default'>
        {title && (
          <Heading marginBottom={16} textAlign='center'>
            {title}
          </Heading>
        )}
        <div className='chart'>
          <Line height={height} data={data} options={options} />
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

LineChart.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  data: PropTypes.object.isRequired
}

LineChart.defaultProps = {
  title: null,
  height: null
}

export default LineChart
