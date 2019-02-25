import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {Pane, Spinner, Paragraph} from 'evergreen-ui'

function Uploader({file, placeholder, onDrop, height, loading, loadingLabel, ...props}) {
  if (loading) {
    return (
      <Pane
        border
        height={150}
        background='tint1'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Spinner size={32} />
        <Paragraph marginTop={8}>Analyse en cours</Paragraph>
      </Pane>
    )
  }

  return (
    <Dropzone multiple={false} onDrop={onDrop}>
      {({getRootProps, getInputProps, isDragActive}) => {
        const rootProps = getRootProps()
        const inputProps = getInputProps()

        return (
          <div {...rootProps} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <Pane
              border
              height={height}
              background='tint1'
              display='flex'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              cursor='pointer'
              wordWrap='break-word'
              elevation={isDragActive ? 0 : null}
              {...props}
            >
              <input {...inputProps} />
              <Paragraph color={file ? 'default' : 'muted'}>
                {file ? file.name : placeholder}
              </Paragraph>
            </Pane>
          </div>
        )
      }}
    </Dropzone>
  )
}

Uploader.propTypes = {
  file: PropTypes.object,
  placeholder: PropTypes.string.isRequired,
  onDrop: PropTypes.func.isRequired,
  height: PropTypes.number,
  loading: PropTypes.bool,
  loadingLabel: PropTypes.string
}

Uploader.defaultProps = {
  file: null,
  height: 100,
  loading: false,
  loadingLabel: 'Chargement…'
}

export default Uploader
