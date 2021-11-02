import PropTypes from 'prop-types'
import {Heading} from 'evergreen-ui'
import {Line} from 'react-chartjs-2'

function LineChart({title, data}) {
  const options = {
    tooltips: {
      mode: 'index'
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month'
        }
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nombre de BAL'
        }
      }
    }
  }

  return (
    <div>
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
