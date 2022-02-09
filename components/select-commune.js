import PropTypes from 'prop-types'
import {Pane, Select} from 'evergreen-ui'

function SelectCommune({communes, selectedCodeCommune, setSelectedCodeCommune}) {
  return (
    <Pane marginTop={8}>
      <Select value={selectedCodeCommune} onChange={event => setSelectedCodeCommune(event.target.value)}>
        {communes.map(({code, nom}) => (
          <option key={code} value={code}>{nom} ({code})</option>
        ))}
      </Select>
    </Pane>
  )
}

SelectCommune.propTypes = {
  communes: PropTypes.array.isRequired,
  selectedCodeCommune: PropTypes.string.isRequired,
  setSelectedCodeCommune: PropTypes.func.isRequired
}

export default SelectCommune
