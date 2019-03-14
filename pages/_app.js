import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Container} from 'next/app'

import {getBaseLocale, getVoies} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'

import Map from '../components/map'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

const SIDEBAR_WIDTH = 500

function App({Component, pageProps}) {
  const [size, setSize] = useState(SIDEBAR_WIDTH)

  const {layout, ...otherPageProps} = pageProps
  const Wrapper = layoutMap[layout] || Fullscreen

  const onToggle = () => {
    setSize(size => size === 0 ? SIDEBAR_WIDTH : 0)
  }

  return (
    <Container>
      <>
        <Map
          interactive={layout === 'sidebar'}
          offset={size}
          commune={pageProps.commune}
        />

        <Wrapper
          size={size}
          elevation={4}
          background='tint2'
          display='flex'
          flexDirection='column'
          onToggle={onToggle}
        >
          <Component {...otherPageProps} />
        </Wrapper>
      </>
    </Container>
  )
}

App.getInitialProps = async ({Component, ctx}) => {
  let pageProps = {}
  let baseLocale
  let commune
  let voies

  if (ctx.query.balId) {
    baseLocale = await getBaseLocale(ctx.query.balId)
  }

  if (ctx.query.codeCommune) {
    commune = await getCommune(ctx.query.codeCommune, {
      fields: 'contour'
    })
  }

  if (baseLocale && commune) {
    voies = await getVoies(baseLocale._id, commune.code)
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({
      ...ctx,
      baseLocale,
      commune,
      voies
    })
  }

  return {pageProps}
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
