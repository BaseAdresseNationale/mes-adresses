import PropTypes from 'prop-types'
import {Popover, Button, Pane} from 'evergreen-ui'

const ACCENTS = [
  'à',
  'á',
  'â',
  'é',
  'è',
  'ê',
  'ë',
  'í',
  'î',
  'ï',
  'ó',
  'ô',
  'ö',
  'ú',
  'ù',
  'û',
  'ü',
  'ç',
  'ñ',
  'œ',
  'l·l',
  'À',
  'Á',
  'Â',
  'É',
  'È',
  'Ê',
  'Ë',
  'Í',
  'Î',
  'Ï',
  'Ó',
  'Ô',
  'Ö',
  'Ú',
  'Ù',
  'Û',
  'Ü',
  'Ç',
  'Ñ',
  'Œ',
  'L·L'
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
        <Pane width={290} height={290} onClick={close}>
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
