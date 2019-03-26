import React from 'react'
import {Marker} from 'react-map-gl'
import {Text} from 'evergreen-ui'
import {css} from 'glamor' // eslint-disable-line import/no-extraneous-dependencies

const markerStyle = css({
  borderRadius: 20,
  marginTop: -10,
  marginLeft: -10,
  color: 'transparent',
  whiteSpace: 'nowrap',

  '&:before': {
    content: ' ',
    backgroundColor: '#1070ca',
    border: '1px solid white',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginLeft: 6
  },

  '& > span': {
    display: 'none'
  },

  '&:hover': {
    background: 'rgba(0, 0, 0, 0.7)',

    '& > span': {
      display: 'inline-block'
    }
  }
})

function NumeroMarker({numero}) {
  const position = numero.positions[0]

  if (!position) {
    return null
  }

  const {coordinates} = position.point

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      captureDrag={false}
      className={markerStyle}
    >
      <Text color='white' paddingLeft={8} paddingRight={10}>
        {numero.numeroComplet}
      </Text>
    </Marker>
  )
}

export default NumeroMarker
