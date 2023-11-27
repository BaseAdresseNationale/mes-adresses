import {useState, useMemo, useContext} from 'react'

import {DrawerContextProvider} from '@/contexts/drawer'
import {DrawContextProvider} from '@/contexts/draw'
import {MarkersContextProvider} from '@/contexts/markers'
import {MapContextProvider} from '@/contexts/map'
import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'
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
import {getBaseLocale, getToponymes, getVoies} from '@/lib/bal-api'
import {ApiGeoService} from '@/lib/geo-api'
import {CommuneType} from '@/types/commune'
import { BaseLocale, CommuneExtraDTO, CommuneService } from '@/lib/openapi'
import { CommuneApiGeoType } from '@/lib/geo-api/type'

interface EditorProps {
  children: React.ReactNode;
  commune: CommuneType;
}

function Editor({children, commune}: EditorProps) {
  const [isHidden, setIsHidden] = useState(false)
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false)
  const {tokenIsChecking} = useContext(TokenContext)
  const {baseLocale} = useContext(BalDataContext)

  const isDemo = baseLocale.status === BaseLocale.status.DEMO

  const leftOffset = useMemo(() => {
    return isHidden ? 0 : 500
  }, [isHidden])

  return (
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
                  <AddressEditor commune={commune} closeForm={() => {
                    setIsAddressFormOpen(false)
                  }} />
                ) : (
                  children
                )}
              </>
            </Sidebar>
          </ParcellesContextProvider>
        </MarkersContextProvider>
      </DrawContextProvider>
    </MapContextProvider>
  )
}

export async function getBaseEditorProps(balId: string) {
  const baseLocale = await getBaseLocale(balId)

  const communeExtras: CommuneExtraDTO = await CommuneService.findCommune(baseLocale.commune)
  const geoCommune: CommuneApiGeoType = await ApiGeoService.getCommune(baseLocale.commune, {
    fields: 'contour'
  })

  const commune: CommuneType = {...geoCommune, ...communeExtras}
  const voies = await getVoies(balId)
  const toponymes = await getToponymes(balId)

  return {
    baseLocale,
    commune,
    voies,
    toponymes
  }
}

export default Editor
