import PropTypes from 'prop-types'
import {Popover, Button, Pane} from 'evergreen-ui'

const ACCENTS = [
  'à',
  'â',
  'é',
  'è',
  'ê',
  'ë',
  'î',
  'ï',
  'ô',
  'ö',
  'ù',
  'û',
  'ü',
  'ç',
  'œ',
  'À',
  'Â',
  'É',
  'È',
  'Ê',
  'Ë',
  'Î',
  'Ï',
  'Ô',
  'Ö',
  'Ù',
  'Û',
  'Ü',
  'Ç',
  'Œ'
]

function AccentTool({input, handleAccent, updateCaret, forwadedRef, isDisabled}) {
  const handleClick = event => {
    const {selectionStart, selectionEnd} = forwadedRef.current
    const valueWithAccent = {target: {value: input.slice(0, selectionStart) + event.target.value + input.slice(selectionEnd)}}

    handleAccent(valueWithAccent)
    updateCaret()
  }

  return (
    <Popover
      content={({close}) => (
        <Pane width={250} height={242} onClick={close}>
          <Pane display='grid' gridTemplateColumns='repeat(auto-fit, minmax(34px, auto))' gridGap={10}>
            {ACCENTS.map(accent => (
              <Button key={accent} appearance='minimal' value={accent} onClick={handleClick}>
                {accent}
              </Button>
            ))}
          </Pane>
        </Pane>
      )}
    >
      <Button type='button' disabled={isDisabled}>É</Button>
    </Popover>
  )
}

AccentTool.propTypes = {
  input: PropTypes.string.isRequired,
  handleAccent: PropTypes.func.isRequired,
  updateCaret: PropTypes.func.isRequired,
  forwadedRef: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool
}

AccentTool.defaultProps = {
  isDisabled: false
}

export default AccentTool
