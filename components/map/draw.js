import {useState, useCallback, useMemo, useContext} from 'react'
import {Editor, EditingMode, DrawLineStringMode} from 'react-map-gl-draw'
import {Portal, Pane, Alert} from 'evergreen-ui'

import DrawContext from '../../contexts/draw'

const MODES = {
  editing: EditingMode,
  drawLineString: DrawLineStringMode,
}

function Draw() {
  const [editor, setEditor] = useState(null)
  const {drawEnabled, modeId, hint, data, setHint, setData} = useContext(DrawContext)

  const editorRef = useCallback(ref => {
    if (ref) {
      setEditor(ref)
    }
  }, [])

  const _onUpdate = useCallback(({data, editType}) => {
    if (editType === 'addTentativePosition') {
      setHint('Cliquez pour ajouter un point ou cliquez sur le dernier pour terminer la voie')
    }

    if (data) {
      setData(data[0])
    }
  }, [setData, setHint])

  const mode = useMemo(() => {
    const Mode = MODES[modeId]
    return Mode ? new Mode() : null
  }, [modeId])

  if (!drawEnabled || !mode) {
    return null
  }

  if (!data && editor) {
    editor.deleteFeatures(0)
  }

  return (
    <>
      <Editor
        ref={editorRef}
        style={{width: '100%', height: '100%'}}
        clickRadius={12}
        mode={mode}
        features={data ? [data] : undefined}
        editHandleShape='circle'
        onUpdate={_onUpdate}
      />

      {hint && (
        <Portal>
          <Pane
            zIndex={999}
            position='fixed'
            width='100%'
            top={116}
            marginTop='0.2em'
          >
            <Pane marginLeft='50%' width='400px'>
              <Alert title={hint} />
            </Pane>
          </Pane>
        </Portal>
      )}
    </>
  )
}

export default Draw
