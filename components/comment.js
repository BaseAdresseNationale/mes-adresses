import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Textarea, Label} from 'evergreen-ui'

const Comment = ({input, onChange}) => {
  return (
    <Pane>
      <Label marginBottom={4} display='block'>
        Commentaire
      </Label>
      <Textarea
        placeholder='Note…'
        value={input}
        onChange={onChange}
      />
    </Pane>
  )
}

Comment.propTypes = {
  input: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Comment.defaultProps = {
  input: ''
}

export default Comment
