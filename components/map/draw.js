import React, {useCallback, useMemo, useContext, useRef, useEffect} from 'react'
import {Editor, EditingMode, DrawLineStringMode} from 'react-map-gl-draw'

import DrawContext from '@/contexts/draw'

const MODES = {
  editing: EditingMode,
  drawLineString: DrawLineStringMode
}

function Draw() {
  const {drawEnabled, modeId, data, setHint, setData} = useContext(DrawContext)
  const editorRef = useRef()

  const _onUpdate = useCallback(({data, editType}) => {
    if (editType === 'addTentativePosition') {
      setHint('Cliquez pour ajouter un point ou cliquez sur le dernier pour terminer la voie')
    }

    if (data) {
      setData(data[0])
    }
  }, [setData, setHint])

  useEffect(() => {
    if (!data && editorRef.current) {
      editorRef.current.deleteFeatures(0)
    }
  }, [data])

  const mode = useMemo(() => {
    const Mode = MODES[modeId]
    return Mode ? new Mode() : null
  }, [modeId])

  if (!drawEnabled || !mode) {
    return null
  }

  return (
    <Editor
      ref={editorRef}
      style={{width: '100%', height: '100%'}}
      clickRadius={12}
      mode={mode}
      features={data ? [data] : undefined}
      editHandleShape='circle'
      onUpdate={_onUpdate}
    />
  )
}

export default React.memo(Draw)
