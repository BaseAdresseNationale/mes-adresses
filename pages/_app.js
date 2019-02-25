import React from 'react'
import NextApp, {Container} from 'next/app'

import Fullscreen from '../components/layout/fullscreen'
import Sidebar from '../components/layout/sidebar'

import Map from '../components/map-uber'

const layoutMap = {
  fullscreen: Fullscreen,
  sidebar: Sidebar
}

class App extends NextApp {
  static async getInitialProps({Component, ctx}) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  componentDidUpdate() {
    console.log(this.mapRef.current)
  }

  render() {
    const {Component, pageProps: {
      layout,
      map,
      ...pageProps
    }} = this.props

    const Wrapper = layoutMap[layout] || Fullscreen

    return (
      <Container>
        <>
          <Map
            ref={this.mapRef}
            interactive={layout === 'sidebar'}
            {...(map || {})}
          />

          <Wrapper elevation={4} background='tint2' display='flex' flexDirection='column'>
            <Component {...pageProps} />
          </Wrapper>
        </>
      </Container>
    )
  }
}

export default App
