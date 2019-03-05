import React from 'react'
import PropTypes from 'prop-types'
import {useDropzone} from 'react-dropzone'
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

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: false
  })

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
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
        <input {...getInputProps()} />
        <Paragraph color={file ? 'default' : 'muted'}>
          {file ? file.name : placeholder}
        </Paragraph>
      </Pane>
    </div>
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
