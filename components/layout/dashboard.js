import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Heading, Pane, Icon} from 'evergreen-ui'

import Map from '../dashboard/map'
import Header from '../header'

const MOBILE_WIDTH = '820'

const defaultProps = {
  title: null,
  backButton: false
}

const propTypes = {
  title: PropTypes.string,
  backButton: PropTypes.bool,
  mapData: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
}

const BackButton = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Heading
      textAlign='center'
      cursor='pointer'
      size={500}
      margin={0}
      padding='1em'
      color='#fff'
      backgroundColor={isHovered ? '#66788a' : '#435a6f'}
      onClick={() => Router.push('/dashboard')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon icon='arrow-left' style={{verticalAlign: 'middle'}} marginRight={4} /> Retour France métropolitaine
    </Heading>
  )
}

const Mobile = ({title, backButton, mapData, children}) => {
  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%'>
      <Header />

      {backButton && (
        <BackButton />
      )}
      <Heading size={600} margin={0} padding='1em' textAlign='center' backgroundColor='#f9f9fb'>
        {title}
      </Heading>

      {children}

      <Map {...mapData} />
    </Pane>
  )
}

Mobile.defaultProps = defaultProps
Mobile.propTypes = propTypes

const Desktop = ({title, mapData, backButton, children}) => {
  return (
    <Pane height='100vh' display='flex' backgroundColor='#fff' flexDirection='column'>
      <Header />

      <Pane display='flex' width='100%' height='calc(100vh - 77px)'>
        <Pane display='flex' flexDirection='column' minWidth={450} overflowY='auto'>
          {backButton && (
            <BackButton />
          )}
          <Heading size={600} margin={0} padding='1em' textAlign='center' backgroundColor='#f9f9fb'>
            {title}
          </Heading>
          {children}
        </Pane>

        <Pane flex={1}>
          <Map {...mapData} />
        </Pane>
      </Pane>
      <style jsx>{`


      `}</style>
    </Pane>
  )
}

Desktop.defaultProps = defaultProps
Desktop.propTypes = propTypes

const DashboardLayout = props => {
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  const handleResize = () => {
    setIsMobileDevice(window.innerWidth < MOBILE_WIDTH)
  }

  useEffect(() => {
    if (window.innerWidth < MOBILE_WIDTH) {
      setIsMobileDevice(true)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const Layout = isMobileDevice ? Mobile : Desktop
  return <Layout {...props} />
}

export default DashboardLayout
