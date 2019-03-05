import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Container} from 'next/app'

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

  const {layout, map, ...otherPageProps} = pageProps
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
          {...(map || {})}
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

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }

  return {pageProps}
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired
}

export default App
