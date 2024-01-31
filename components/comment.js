import PropTypes from 'prop-types'
import {Textarea, Label} from 'evergreen-ui'

import FormInput from '@/components/form-input'

function Comment({input, limit, onChange, isDisabled}) {
  return (
    <FormInput>
      <Label marginBottom={4} display='block'>
        Commentaire
      </Label>
      <Textarea
        placeholder='Cette note est confidentielle et ne sera pas diffusée.'
        value={input}
        disabled={isDisabled}
        onChange={input.length < limit ? onChange : () => {}}
      />
    </FormInput>
  )
}

Comment.propTypes = {
  input: PropTypes.string,
  limit: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
}

Comment.defaultProps = {
  input: '',
  limit: 5000,
  isDisabled: false
}

export default Comment
