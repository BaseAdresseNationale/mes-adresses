import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Textarea, Label} from 'evergreen-ui'

const Comment = ({input, limit, onChange}) => {
  return (
    <Pane>
      <Label marginBottom={4} display='block'>
        Commentaire
      </Label>
      <Textarea
        placeholder='Note…'
        value={input}
        onChange={input.length < limit ? onChange : () => {}}
      />
    </Pane>
  )
}

Comment.propTypes = {
  input: PropTypes.string,
  limit: PropTypes.number,
  onChange: PropTypes.func.isRequired
}

Comment.defaultProps = {
  input: '',
  limit: 5000
}

export default Comment
