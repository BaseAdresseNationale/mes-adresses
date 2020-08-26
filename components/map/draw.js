import React, {useCallback, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'
import {Popup} from 'react-map-gl'
import {Editor, EditingMode, DrawLineStringMode} from 'react-map-gl-draw'
import {Text} from 'evergreen-ui'

import DrawContext from '../../contexts/draw'

const MODES = {
  editing: EditingMode,
  drawLineString: DrawLineStringMode
}

const Draw = ({hoverPos}) => {
  const {drawEnabled, modeId, data, hint, setHint, setData} = useContext(DrawContext)

  const _onUpdate = useCallback(({data, editType}) => {
    if (editType === 'addTentativePosition') {
      setHint('Cliquez pour ajouter un point ou cliquez sur le dernier pour terminer la voie')
    }

    if (data) {
      setData(data[0])
      console.log('setData')
    }
  }, [setData, setHint])

  const mode = useMemo(() => {
    const Mode = MODES[modeId]
    return Mode ? new Mode() : null
  }, [modeId])

  if (!drawEnabled || !mode) {
    return null
  }

  return (
    <>
      <Editor
        style={{width: '100%', height: '100%'}}
        clickRadius={12}
        mode={mode}
        features={data ? [data] : null}
        editHandleShape='circle'
        onUpdate={_onUpdate}
      />

      {hoverPos && hint && (
        <Popup {...hoverPos} closeButton={false}>
          <Text>{hint}</Text>
        </Popup>
      )}
    </>
  )
}

Draw.defaultProps = {
  lineVoie: null,
  hoverPos: null
}

Draw.propTypes = {
  lineVoie: PropTypes.array,
  hoverPos: PropTypes.object,
  handleVoieLine: PropTypes.func.isRequired,
  setModeId: PropTypes.func.isRequired
}

export default Draw
