import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'

import {SettingsContextProvider} from '@/contexts/settings'
import {DrawContextProvider} from '@/contexts/draw'
import {MarkersContextProvider} from '@/contexts/markers'
import {MapContextProvider} from '@/contexts/map'
import {BalDataContextProvider} from '@/contexts/bal-data'
import {ParcellesContextProvider} from '@/contexts/parcelles'

import Sidebar from '@/layouts/sidebar'

import SubHeader from '@/components/sub-header'
import Map from '@/components/map'
import WelcomeMessage from '@/components/welcome-message'
import CertificationMessage from '@/components/certification-message'
import Settings from '@/components/settings'

function Editor({baseLocale, commune, voie, toponyme, children}) {
  const [isHidden, setIsHidden] = useState(false)

  const leftOffset = useMemo(() => {
    return isHidden ? 0 : 500
  }, [isHidden])

  const topOffset = useMemo(() => {
    return baseLocale.status === 'demo' ? 166 : 116
  }, [baseLocale])

  return (
    <BalDataContextProvider initialBaseLocale={baseLocale} initialCommune={commune} idVoie={voie?._id} idToponyme={toponyme?._id}>
      <MapContextProvider>
        <DrawContextProvider>
          <MarkersContextProvider>
            <ParcellesContextProvider>

              <SettingsContextProvider>
                <Settings />
                <SubHeader initialeVoie={voie} initialToponyme={toponyme} />
              </SettingsContextProvider>

              <Map
                top={116}
                left={leftOffset}
                voie={voie}
                toponyme={toponyme}
              />

              <Sidebar
                top={topOffset}
                isHidden={isHidden}
                size={500}
                elevation={2}
                background='tint2'
                display='flex'
                flexDirection='column'
                onToggle={setIsHidden}
              >
                <>
                  <WelcomeMessage />
                  {baseLocale.status === 'published' && (
                    <CertificationMessage balId={baseLocale._id} codeCommune={commune?.code} />
                  )}

                  {children}
                </>
              </Sidebar>
            </ParcellesContextProvider>
          </MarkersContextProvider>
        </DrawContextProvider>
      </MapContextProvider>
    </BalDataContextProvider>
  )
}

Editor.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
  }),
  voie: PropTypes.object,
  toponyme: PropTypes.object,
  children: PropTypes.node.isRequired
}

export default Editor
