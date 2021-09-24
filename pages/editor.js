import React, {useState, useCallback, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'

import {Pane, Spinner} from 'evergreen-ui'
import SubHeader from '../components/sub-header'
import WelcomeMessage from '../components/welcome-message'
import CertificationMessage from '../components/certification-message'

import Map from '../components/map'

import {SettingsContextProvider} from '../contexts/settings'
import {DrawContextProvider} from '../contexts/draw'
import {MarkersContextProvider} from '../contexts/markers'
import {MapContextProvider} from '../contexts/map'
import {ParcellesContextProvider} from '../contexts/parcelles'
import BalDataContext from '../contexts/bal-data'

import Settings from '../components/settings'
import Sidebar from '../components/layout/sidebar'

function Editor({children, pageProps}) {
  const {baseLocale, commune} = useContext(BalDataContext)

  const [isHidden, setIsHidden] = useState(false)

  const onToggle = useCallback(isEditing => {
    if (isEditing && isHidden) { // Force opening sidebar when numero is edited:
      setIsHidden(false)
    } else {
      setIsHidden(isHidden => !isHidden)
    }
  }, [isHidden])

  const leftOffset = useMemo(() => {
    if (!isHidden) {
      return 500
    }

    return 0
  }, [isHidden])

  const topOffset = useMemo(() => {
    if (baseLocale?.status === 'demo') {
      return 166 // Adding space for demo-warning component
    }

    return 116
  }, [baseLocale])

  return (
    <MapContextProvider>
      <DrawContextProvider>
        <MarkersContextProvider>
          <ParcellesContextProvider>

            <WelcomeMessage />

            {baseLocale.status === 'published' && (
              <CertificationMessage balId={baseLocale._id} codeCommune={commune.code} />
            )}

            {baseLocale ? (
              <>
                <SettingsContextProvider>
                  <Settings nomBaseLocale={baseLocale.nom} />
                  <SubHeader {...pageProps} />
                </SettingsContextProvider>

                <Map
                  top={topOffset}
                  left={leftOffset}
                  {...pageProps}
                />

                <Sidebar
                  top={topOffset}
                  isHidden={isHidden}
                  size={500}
                  elevation={2}
                  background='tint2'
                  display='flex'
                  flexDirection='column'
                  onToggle={onToggle}
                >
                  {children}
                </Sidebar>
              </>
            ) : (
              <Pane display='flex' alignItems='center' justifyContent='center' height={400}>
                <Spinner />
              </Pane>
            )}

          </ParcellesContextProvider>
        </MarkersContextProvider>
      </DrawContextProvider>
    </MapContextProvider>
  )
}

Editor.defaultProps = {
  error: null
}

Editor.propTypes = {
  error: PropTypes.shape({
    statusCode: PropTypes.string.isRequired
  }),
  children: PropTypes.node.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default Editor
