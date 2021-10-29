import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Textarea, Label} from 'evergreen-ui'

const Comment = ({input, limit, onChange, isDisabled}) => {
  return (
    <Pane>
      <Label marginBottom={4} display='block'>
        Commentaire
      </Label>
      <Textarea
        placeholder='Note…'
        value={input}
        disabled={isDisabled}
        onChange={input.length < limit ? onChange : () => {}}
      />
    </Pane>
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
