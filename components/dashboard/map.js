import React, {useState, useRef, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import MapGL, {Source, Layer, Popup} from 'react-map-gl'
import {Paragraph, Heading, Alert} from 'evergreen-ui'

import {colors} from '../../lib/colors'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 4
}

const communesLayer = {
  id: 'communes-fill',
  'source-layer': 'communes',
  type: 'fill',
  paint: {
    'fill-color': '#ffffff',
    'fill-opacity': 0.75,
    'fill-outline-color': '#ffffff'
  }
}

const Map = ({basesLocales, contours}) => {
  const [viewport, setViewport] = useState(defaultViewport)
  const [hovered, setHovered] = useState(null)
  const [hoveredStateId, setHoveredStateId] = useState(null)
  const [warningZoom, setWarningZoom] = useState(false)
  const [isZoomActivated, setIsZoomActivated] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [isDragPanEnabled, setIsDragPanEnabled] = useState(false)
  const [hoveredCommune, setHoveredCommune] = useState(null)
  const mapRef = useRef()

  const balLayer = {
    id: 'balLayer',
    type: 'fill',
    paint: {
      'fill-color': [
        'match',
        ['get', 'maxStatus'],
        'draft',
        colors.neutral,
        'ready-to-publish',
        colors.blue,
        'published',
        colors.green,
        'white'
      ],
      'fill-opacity': [
        'case',
        ['==', ['get', 'code'], hoveredStateId ? hoveredStateId : null],
        0.8,
        1
      ],
      'fill-outline-color': '#ffffff'
    }
  }

  const handleResize = useCallback(() => {
    if (mapRef && mapRef.current) {
      setViewport(viewport)
    }
  }, [viewport])

  const onHover = useCallback(event => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      const nextHoveredStateId = feature.properties.code
      const [longitude, latitude] = event.lngLat
      const hoverInfo = {
        longitude,
        latitude,
        feature
      }
      const communeNumber = basesLocales.filter(({communes}) => communes.includes(hoveredStateId)).length

      setHovered(hoverInfo)
      setHoveredCommune(communeNumber)

      if (hoveredStateId !== nextHoveredStateId) {
        setHoveredStateId(nextHoveredStateId)
      }
    }
  }, [basesLocales, hoveredStateId])

  const onLeave = useCallback(() => {
    if (hoveredStateId) {
      setHoveredStateId(null)
    }
  }, [hoveredStateId])

  const onWheel = useCallback(event => {
    event.stopPropagation()
    if (isZoomActivated) {
      setWarningZoom(false)
    } else {
      setWarningZoom(true)
    }
  }, [isZoomActivated])

  const handleDoubleClick = useCallback(event => {
    event.stopPropagation()
    setIsZoomActivated(!isZoomActivated)
  }, [isZoomActivated])

  const handleMobileTouch = useCallback(event => {
    event.stopPropagation()
    const {touches} = event
    if (touches.length > 1) {
      setIsDragPanEnabled(true)
    } else {
      setIsDragPanEnabled(false)
    }
  }, [])

  useEffect(() => {
    setIsTouchScreenDevice('ontouchstart' in document.documentElement)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    const mapBox = document.querySelector('.map')

    mapBox.addEventListener('touchmove', handleMobileTouch)
    return () => {
      mapBox.addEventListener('touchmove', handleMobileTouch)
    }
  }, [handleMobileTouch])

  useEffect(() => {
    if (warningZoom) {
      const timer = setTimeout(() => setWarningZoom(false), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [warningZoom])

  return (
    <div ref={mapRef} className='map'>
      <MapGL
        {...viewport}
        touchZoom
        dragPan={!isTouchScreenDevice || isDragPanEnabled}
        width='100%'
        height='100%'
        doubleClickZoom={false}
        scrollZoom={isZoomActivated}
        mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
        onDblClick={handleDoubleClick}
        onViewportChange={setViewport}
        onHover={onHover}
        onLeave={onLeave}
        onWheel={onWheel}
      >
        {warningZoom && !isTouchScreenDevice && (
          <div className='map warning-zoom'>
            <Alert
              intent='warning'
              title='Double-cliquez sur la carte pour activer le zoom'
            />
          </div>
        )}

        <Source
          id='decoupage-administratif'
          type='vector'
          url='https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json'
        >
          <Layer
            {...communesLayer}
            id='decoupage-administratif-fills'
            source='decoupage-administratif'
            beforeId='place-town'
          />
        </Source>

        <Source id='contours-bal' type='geojson' data={contours}>
          <Layer
            {...balLayer}
            id='contours-bal-fills'
            source='contours-bal'
            beforeId='place-town'
          />
        </Source>

        {hovered && hovered.feature.properties.maxStatus && viewport.zoom > 5 && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor='bottom-left'
            onClose={() => setHovered(null)}
          >
            <Heading>
              {hovered.feature.properties.nom}
            </Heading>
            <Paragraph>
              {`${hoveredCommune} ${hoveredCommune > 1 ? 'Bases Adresse Locales' : 'base adresse locale'}`}
            </Paragraph>
          </Popup>
        )}
      </MapGL>

      <style jsx>{`
        .map {
          width: 100%;
          min-width: 270px;
          height: 100%;
        }

        .warning-zoom {
          text-align: center;
          background-color: rgba(0, 0, 0, 0.4);
        }

        @media screen and (max-width: 960px) {
          .map {
            height: 330px;
          }
        }
        `}</style>
    </div>
  )
}

Map.defaultProps = {
  contours: null
}

Map.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  contours: PropTypes.object
}

export default Map
