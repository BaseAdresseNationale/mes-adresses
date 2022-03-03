import {useState, useMemo, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import {Pane, Dialog, Paragraph} from 'evergreen-ui'

import 'mapbox-gl/dist/mapbox-gl.css'

import {getBaseLocale, getVoie, getToponyme} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import SubHeader from '../components/sub-header'
import IEWarning from '../components/ie-warning'
import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'
import WelcomeMessage from '../components/welcome-message'
import CertificationMessage from '../components/certification-message'

import Map from '../components/map'
import Help from '../components/help'

import {LocalStorageContextProvider} from '../contexts/local-storage'
import {HelpContextProvider} from '../contexts/help'
import {SettingsContextProvider} from '../contexts/settings'
import {DrawContextProvider} from '../contexts/draw'
import {MarkersContextProvider} from '../contexts/markers'
import {MapContextProvider} from '../contexts/map'
import {TokenContextProvider} from '../contexts/token'
import {BalDataContextProvider} from '../contexts/bal-data'
import {ParcellesContextProvider} from '../contexts/parcelles'

import useWindowSize from '../hooks/window-size'
import Settings from '../components/settings'

import Header from '../components/header'

import ErrorPage from './_error'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

function App({error, Component, pageProps, query}) {
  const {innerWidth} = useWindowSize()
  const [isShown, setIsShown] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const {layout, ...otherPageProps} = pageProps
  const Wrapper = layoutMap[layout] || Fullscreen

  const leftOffset = useMemo(() => {
    if (layout === 'sidebar' && !isHidden) {
      return 500
    }

    return 0
  }, [layout, isHidden])

  const topOffset = useMemo(() => {
    if (pageProps.baseLocale && pageProps.baseLocale.status === 'demo') {
      return 166 // Adding space for demo-warning component
    }

    return pageProps.baseLocale ? 116 : 0
  }, [pageProps.baseLocale])

  useEffect(() => {
    if (innerWidth && innerWidth < 700 && !/(\/dashboard)/.test(location.pathname)) {
      setIsShown(true)
    }
  }, [innerWidth])

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>mes-adresses.data.gouv.fr</title>
      </Head>

      <Pane>
        <Dialog
          isShown={isShown}
          title='Attention'
          confirmLabel='Continuer'
          hasCancel={false}
          onCloseComplete={() => setIsShown(false)}
        >
          <Paragraph marginTop='default'>
            Afin de profiter d’une meilleure expérience, il est recommandé d’utiliser cet outil sur un écran plus grand 🖥
          </Paragraph>
          <Paragraph marginTop='default'>
            Une version mobile est en cours de développement pour toujours avoir sa Base Adresse Locale à portée de main 💪🏻
          </Paragraph>
          <Paragraph marginTop='default'>
            Merci de votre patience 🙏
          </Paragraph>
        </Dialog>
      </Pane>

      <LocalStorageContextProvider>
        <TokenContextProvider balId={query.balId} _token={query.token}>
          <BalDataContextProvider balId={query.balId} codeCommune={query.codeCommune} idVoie={query.idVoie} idToponyme={query.idToponyme}>
            <MapContextProvider>
              <DrawContextProvider>
                <MarkersContextProvider>
                  <ParcellesContextProvider>
                    <HelpContextProvider>

                      <Help />

                      {pageProps.baseLocale && (
                        <SettingsContextProvider>
                          <Settings initialBaseLocale={pageProps.baseLocale} codeCommune={pageProps.commune?.code} />
                          <Header />
                          <SubHeader
                            {...pageProps}
                            initialBaseLocale={pageProps.baseLocale}
                            isFranceConnectAuthentication={query['france-connect'] === '1'}
                          />
                        </SettingsContextProvider>
                      )}

                      {pageProps.baseLocale && (
                        <Map
                          top={topOffset}
                          left={leftOffset}
                          commune={pageProps.commune}
                          voie={pageProps.voie}
                          toponyme={pageProps.toponyme}
                        />
                      )}

                      <Wrapper
                        top={topOffset}
                        isHidden={isHidden}
                        size={500}
                        elevation={2}
                        background='tint2'
                        display='flex'
                        flexDirection='column'
                        onToggle={setIsHidden}
                      >
                        {error ? (
                          <ErrorPage statusCode={error.statusCode} />
                        ) : (
                          <>
                            <IEWarning />
                            {pageProps.baseLocale && <WelcomeMessage />}
                            {pageProps.baseLocale && pageProps.baseLocale.status === 'published' && (
                              <CertificationMessage balId={query.balId} codeCommune={query.codeCommune} />
                            )}
                            <Component {...otherPageProps} />
                          </>
                        )}
                      </Wrapper>
                    </HelpContextProvider>
                  </ParcellesContextProvider>
                </MarkersContextProvider>
              </DrawContextProvider>
            </MapContextProvider>
          </BalDataContextProvider>
        </TokenContextProvider>
      </LocalStorageContextProvider>
      {/* ⚠️ This is needed to expand Evergreen’Tootip width
      It select all Tooltip components with 'appearance: card' propertie */}
      <style jsx global>{`
        div[id^="evergreen-tooltip"].ub-max-w_240px.ub-bg-clr_white.ub-box-szg_border-box {
          max-width: fit-content;
        }
      `}</style>
    </>
  )
}

App.getInitialProps = async ({Component, ctx}) => {
  const {query} = ctx

  let pageProps = {
    layout: 'fullscreen'
  }

  let baseLocale
  let commune
  let voie
  let toponyme

  try {
    if (query.balId) {
      baseLocale = await getBaseLocale(query.balId)
    }

    if (query.codeCommune) {
      if (baseLocale.communes.includes(query.codeCommune)) {
        commune = await getCommune(query.codeCommune, {
          fields: 'contour'
        })
      } else {
        throw new Error('La commune demandée ne fais pas partie de la Base Adresse Locale')
      }
    }

    if (query.idVoie) {
      voie = await getVoie(query.idVoie)
    }

    if (query.idToponyme) {
      toponyme = await getToponyme(query.idToponyme)
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
        baseLocale,
        commune,
        voie,
        toponyme
      })
    }
  } catch {
    return {
      pageProps,
      error: {
        statusCode: 404
      }
    }
  }

  return {
    pageProps,
    query
  }
}

App.propTypes = {
  error: PropTypes.shape({
    statusCode: PropTypes.number
  }),
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
  query: PropTypes.object,
  geojson: PropTypes.object
}

App.defaultProps = {
  query: {},
  error: null,
  geojson: null
}

export default App
