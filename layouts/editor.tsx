import {useState, useMemo, useContext} from 'react'

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
import {BaseLocaleType} from 'types/base-locale'
import {CommmuneType} from 'types/commune'
import {getBaseLocale, getCommuneExtras, getToponymes, getVoies} from '@/lib/bal-api'
import {getCommune} from '@/lib/geo-api'

interface EditorProps {
  baseLocale: BaseLocaleType;
  commune: CommmuneType;
  voie: any;
  toponyme: any;
  voies: any[];
  toponymes: any[];
  numeros: any[];
  children: React.ReactNode;
}

function Editor({baseLocale, commune, voie, toponyme, voies, toponymes, numeros, children}: EditorProps) {
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
    </BalDataContextProvider>
  )
}

export async function getBaseEditorProps(balId: string) {
  const baseLocale = await getBaseLocale(balId)

  const communeExtras = await getCommuneExtras(baseLocale.commune)
  const geoCommune = await getCommune(baseLocale.commune, {
    fields: 'contour'
  })

  const commune = {...geoCommune, ...communeExtras}
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
