import React from 'react'
import Map from '../components/map-uber'

function Index() {
  return (
    <Map />
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
