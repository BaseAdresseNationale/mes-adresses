import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import {Pie} from 'react-chartjs-2'
import {Pane, Heading} from 'evergreen-ui'

const PieChart = ({title, data, height}) => {
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
    <div className='chart-container'>
      <Pane elevation={1} border='default'>
        {title && (
          <Heading textAlign='center'>
            {title}
          </Heading>
        )}
        <div className='chart'>
          <Pie ref={chartRef} height={height} data={chart} options={options} />
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
