import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {Bar} from 'react-chartjs-2'

const BarChart = ({title, data, height}) => {
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month'
        },
        stacked: true,
        gridLines: {
          offsetGridLines: true
        },
        offset: true
      }],
      yAxes: [{
        stacked: true
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
          <Bar height={height} data={data} options={options} />
        </div>
      </Pane>
      <style jsx>{`
        .chart-container {
          margin: 0 auto;
          width: 55vw;
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

BarChart.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
  data: PropTypes.object.isRequired
}

BarChart.defaultProps = {
  title: null,
  height: null
}

export default BarChart
