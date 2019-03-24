import {stringify, parse} from 'querystring'
import React, {useState, useCallback, useMemo, useEffect} from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import {Container} from 'next/app'

import {getBaseLocale, getCommuneGeoJson, getVoies, getVoie, getNumeros} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'
import {storeBalAccess} from '../lib/tokens'

import Header from '../components/header'
import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'

import Map from '../components/map'

import {MarkerContextProvider} from '../contexts/marker'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

const SIDEBAR_WIDTH = 500

function App({Component, pageProps, query, geojson}) {
  const [isHidden, setIsHidden] = useState(false)

  const {layout, ...otherPageProps} = pageProps
  const Wrapper = layoutMap[layout] || Fullscreen

  useEffect(() => {
    if (query.token && pageProps.baseLocale) {
      storeBalAccess(pageProps.baseLocale._id, query.token)

      const {token: _0, ...hrefQuery} = query
      const [hostname, qs] = Router.asPath.split('?', 2)
      const {token: _1, ...asQuery} = parse(qs)

      Router.replace(
        `${Router.pathname}?${stringify(hrefQuery)}`,
        `${hostname}?${stringify(asQuery)}`
      )
    }
  }, [query.token, pageProps.baseLocale, query])

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
          <Component {...otherPageProps} />
        </Wrapper>
      </MarkerContextProvider>
    </Container>
  )
}

App.getInitialProps = async ({Component, ctx}) => {
  let pageProps = {}
  let baseLocale
  let commune
  let voies
  let voie
  let numeros
  let geojson

  if (ctx.query.balId) {
    baseLocale = await getBaseLocale(ctx.query.balId)
  }

  if (ctx.query.codeCommune) {
    commune = await getCommune(ctx.query.codeCommune, {
      fields: 'contour'
    })
  }

  if (ctx.query.idVoie) {
    voie = await getVoie(ctx.query.idVoie)
    numeros = await getNumeros(voie._id)
  }

  if (baseLocale && commune) {
    voies = await getVoies(baseLocale._id, commune.code)
    geojson = await getCommuneGeoJson(baseLocale._id, commune.code)
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
    query: ctx.query,
    geojson
  }
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
