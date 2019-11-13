import React, {useState, useCallback, useMemo, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Container} from 'next/app'
import ErrorPage from 'next/error'
import {Pane, Dialog, Paragraph} from 'evergreen-ui'

import {getBaseLocale, getVoie} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import Header from '../components/header'
import IEWarning from '../components/ie-warning'
import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'

import Map from '../components/map'
import Help from '../components/help'

import {HelpContextProvider} from '../contexts/help'
import {MarkerContextProvider} from '../contexts/marker'
import {TokenContextProvider} from '../contexts/token'
import {BalDataContextProvider} from '../contexts/bal-data'

import useWindowSize from '../hooks/window-size'
import useError from '../hooks/error'
import {getPublishedBasesLocales} from '../lib/adresse-backend'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

function App({error, Component, pageProps, query}) {
  const [baseLocale, setBaseLocale] = useState(null)
  const [setError] = useError(null)
  const {innerWidth} = useWindowSize()
  const [isShown, setIsShown] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const {layout, ...otherPageProps} = pageProps
  const Wrapper = layoutMap[layout] || Fullscreen

  const onToggle = useCallback(isEditing => {
    if (isEditing === null) {
      setIsHidden(isHidden => !isHidden)
    } else {
      setIsHidden(false)
    }
  }, [])

  const leftOffset = useMemo(() => {
    if (layout === 'sidebar' && !isHidden) {
      return 500
    }

    return 0
  }, [layout, isHidden])

  const topOffset = useMemo(() => {
    return baseLocale ? 40 : 0
  }, [baseLocale])

  useEffect(() => {
    if (innerWidth && innerWidth < 700) {
      setIsShown(true)
    }
  }, [innerWidth])

  useEffect(() => {
    const expandWithPublished = async baseLocale => {
      const publishedBasesLocales = await getPublishedBasesLocales()
      baseLocale.published = Boolean(publishedBasesLocales.find(bal => bal._id === baseLocale._id))
      setBaseLocale(baseLocale)
    }

    if (pageProps.baseLocale) {
      const {baseLocale} = pageProps
      expandWithPublished(baseLocale)
    } else {
      setBaseLocale(null)
    }
  }, [pageProps, pageProps.baseLocale])

  const refreshBaseLocale = async () => {
    try {
      const baseLocale = await getBaseLocale(query.balId)
      setBaseLocale(baseLocale)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Container>

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

      <TokenContextProvider balId={query.balId} token={query.token}>
        <BalDataContextProvider balId={query.balId} codeCommune={query.codeCommune} idVoie={query.idVoie}>
          <MarkerContextProvider>
            <HelpContextProvider>

              <Help />

              {baseLocale && (
                <Header
                  {...pageProps}
                  baseLocale={baseLocale}
                  layout={layout}
                  isSidebarHidden={isHidden}
                  refreshBaseLocale={refreshBaseLocale}
                  onToggle={onToggle}
                />
              )}

              <Map
                top={topOffset}
                left={leftOffset}
                animate={layout === 'sidebar'}
                interactive={layout === 'sidebar'}
                baseLocale={baseLocale}
                commune={pageProps.commune}
                voie={pageProps.voie}
              />

              <Wrapper
                top={topOffset}
                isHidden={isHidden}
                size={500}
                elevation={2}
                background='tint2'
                display='flex'
                flexDirection='column'
                onToggle={onToggle}
              >
                {error ? (
                  <ErrorPage statusCode={error.statusCode} />
                ) : (
                  <>
                    <IEWarning />
                    <Component {...otherPageProps} />
                  </>
                )}
              </Wrapper>
            </HelpContextProvider>
          </MarkerContextProvider>
        </BalDataContextProvider>
      </TokenContextProvider>
    </Container>
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

  if (query.balId) {
    try {
      baseLocale = await getBaseLocale(query.balId)
    } catch (error) {
      return {
        pageProps,
        error: {
          statusCode: 404
        }
      }
    }
  }

  if (query.codeCommune) {
    try {
      commune = await getCommune(query.codeCommune, {
        fields: 'contour'
      })
    } catch (error) {
      commune = {
        code: query.codeCommune
      }
    }
  }

  if (query.idVoie) {
    voie = await getVoie(query.idVoie)
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({
      ...ctx,
      baseLocale,
      commune,
      voie
    })
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
