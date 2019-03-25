import React, {useState, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Container} from 'next/app'
import ErrorPage from 'next/error'

import {getBaseLocale, getCommuneGeoJson, getVoies, getVoie, getNumeros} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import Header from '../components/header'
import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'

import Map from '../components/map'

import {MarkerContextProvider} from '../contexts/marker'
import {TokenContextProvider} from '../contexts/token'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

const SIDEBAR_WIDTH = 500

function App({error, Component, pageProps, query, geojson}) {
  const [isHidden, setIsHidden] = useState(false)

  const {layout, ...otherPageProps} = pageProps
  const Wrapper = layoutMap[layout] || Fullscreen

  const onToggle = useCallback(() => {
    setIsHidden(isHidden => !isHidden)
  }, [])

  const leftOffset = useMemo(() => {
    if (layout === 'sidebar' && !isHidden) {
      return SIDEBAR_WIDTH
    }

    return 0
  }, [layout, isHidden])

  const topOffset = useMemo(() => {
    return pageProps.baseLocale ? 40 : 0
  }, [pageProps.baseLocale])

  return (
    <Container>
      <TokenContextProvider balId={query.balId} token={query.token}>
        <MarkerContextProvider>
          {pageProps.baseLocale && (
            <Header {...pageProps} />
          )}

          <Map
            top={topOffset}
            left={leftOffset}
            animate={layout === 'sidebar'}
            interactive={layout === 'sidebar'}
            baseLocale={pageProps.baseLocale}
            commune={pageProps.commune}
            voie={pageProps.voie}
            geojson={geojson}
          />

          <Wrapper
            top={topOffset}
            isHidden={isHidden}
            size={SIDEBAR_WIDTH}
            elevation={4}
            background='tint2'
            display='flex'
            flexDirection='column'
            onToggle={onToggle}
          >
            {error ? (
              <ErrorPage statusCode={error.statusCode} />
            ) : (
              <Component {...otherPageProps} />
            )}
          </Wrapper>
        </MarkerContextProvider>
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
  let voies
  let voie
  let numeros
  let geojson

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
    [voie, numeros] = await Promise.all([
      getVoie(query.idVoie),
      getNumeros(query.idVoie)
    ])
  }

  if (baseLocale && commune) {
    [voies, geojson] = await Promise.all([
      getVoies(baseLocale._id, commune.code),
      getCommuneGeoJson(baseLocale._id, commune.code)
    ])
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({
      ...ctx,
      baseLocale,
      commune,
      voies,
      voie,
      numeros
    })
  }

  return {
    pageProps,
    query,
    geojson
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
  query: {}
}

export default App
