import {useState, useMemo, useContext} from 'react'
import PropTypes from 'prop-types'

import {DrawerContextProvider} from '@/contexts/drawer'
import {DrawContextProvider} from '@/contexts/draw'
import {MarkersContextProvider} from '@/contexts/markers'
import {MapContextProvider} from '@/contexts/map'
import TokenContext from '@/contexts/token'
import BalDataContext, {BalDataContextProvider} from '@/contexts/bal-data'
import {ParcellesContextProvider} from '@/contexts/parcelles'

import Sidebar from '@/layouts/sidebar'

import SubHeader from '@/components/sub-header'
import Map from '@/components/map'
import WelcomeMessage from '@/components/welcome-message'
import CertificationMessage from '@/components/certification-message'
import DrawerContent from '@/components/drawer-content'
import AddressEditor from '@/components/bal/address-editor'
import DemoWarning from '@/components/demo-warning'
import Overlay from '@/components/overlay'

function Editor({baseLocale, commune, voie, toponyme, voies, toponymes, numeros, children}) {
  const [isHidden, setIsHidden] = useState(false)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const {tokenIsChecking} = useContext(TokenContext)

  const isDemo = baseLocale.status === 'demo'

  const leftOffset = useMemo(() => {
    return isHidden ? 0 : 500
  }, [isHidden])

  return (
    <BalDataContextProvider
      initialBaseLocale={baseLocale}
      initialVoie={voie}
      initialToponyme={toponyme}
      initialVoies={voies}
      initialToponymes={toponymes}
      initialNumeros={numeros}
    >
      <MapContextProvider>
        <DrawContextProvider>
          <MarkersContextProvider>
            <ParcellesContextProvider>
              <BalDataContext.Consumer>
                {({habilitationIsLoading}) => (
                  (tokenIsChecking || habilitationIsLoading) && (
                    <Overlay text='Chargement de la Base Adresse Locale' />
                  )
                )}
              </BalDataContext.Consumer>

              <DrawerContextProvider>
                <DrawerContent />
                <SubHeader commune={commune} />
              </DrawerContextProvider>

              <Map
                top={116}
                bottom={isDemo ? 50 : 0}
                left={leftOffset}
                commune={commune}
                isAddressFormOpen={isAddressFormOpen}
                handleAddressForm={setIsAddressFormOpen}
              />

              <Sidebar
                top={116}
                bottom={isDemo ? 50 : 0}
                isHidden={isHidden}
                size={500}
                elevation={2}
                background='tint2'
                display='flex'
                flexDirection='column'
                onToggle={setIsHidden}
              >
                <>
                  {isDemo && (
                    <DemoWarning baseLocale={baseLocale} communeName={commune.nom} />
                  )}

                  <WelcomeMessage />
                  {baseLocale.status === 'published' && (
                    <CertificationMessage balId={baseLocale._id} />
                  )}

                  {isAddressFormOpen ? (
                    <AddressEditor commune={commune} closeForm={() => setIsAddressFormOpen(false)} />
                  ) : (
                    children
                  )}
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
  commune: PropTypes.object.isRequired,
  voie: PropTypes.object,
  toponyme: PropTypes.object,
  voies: PropTypes.array,
  toponymes: PropTypes.array,
  numeros: PropTypes.array,
  children: PropTypes.node.isRequired
}

export default Editor
