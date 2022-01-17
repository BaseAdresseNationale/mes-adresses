import {useState, useRef, useEffect, useCallback} from 'react'
import Router from 'next/router'
import PropTypes from 'prop-types'
import MapGL, {Source, Layer, Popup, WebMercatorViewport} from 'react-map-gl'
import {Paragraph, Heading, Alert} from 'evergreen-ui'

import {colors} from '../../lib/colors'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 4
}

const defaultGeoData = {
  bbox: [-5.317, 41.277, 9.689, 51.234]
}

function Map({departement, basesLocales, contours}) {
  const [viewport, setViewport] = useState(defaultViewport)
  const [hovered, setHovered] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [warningZoom, setWarningZoom] = useState(false)
  const [isZoomActivated, setIsZoomActivated] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [isDragPanEnabled, setIsDragPanEnabled] = useState(false)
  const [hoveredCommune, setHoveredCommune] = useState(null)
  const [selectedDepartement, setSelectedDepartement] = useState(null)
  const [geoData, setGeoData] = useState(defaultGeoData)
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
        ['==', ['get', 'code'], hoveredId ? hoveredId : null],
        0.8,
        1
      ],
      'fill-outline-color': '#ffffff'
    }
  }

  const departementsLayer = {
    id: 'departements-fill',
    'source-layer': 'departements',
    type: 'fill',
    paint: {
      'fill-color': '#ffffff',
      'fill-opacity': [
        'case',
        ['==', ['get', 'code'], selectedDepartement ? selectedDepartement : null],
        0.5,
        ['==', ['get', 'code'], hoveredId ? hoveredId : null],
        0.8,
        0.3
      ],
      'fill-outline-color': '#000'
    }
  }

  const handleResize = useCallback(() => {
    if (mapRef && mapRef.current) {
      const width = mapRef.current.offsetWidth
      const height = mapRef.current.offsetHeight

      const {bbox} = geoData
      const padding = width > 50 && height > 50 ? 20 : 0
      const viewport = new WebMercatorViewport({width, height})
        .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding})

      setViewport(viewport)
    }
  }, [geoData])

  const onHover = useCallback(event => {
    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      const nextHoveredId = feature.properties.code
      const [longitude, latitude] = event.lngLat
      const hoverInfo = {
        longitude,
        latitude,
        feature
      }
      const communeBALNumber = basesLocales.filter(({communes}) => communes.includes(hoveredId)).length

      setHovered(hoverInfo)
      setHoveredCommune(communeBALNumber)

      if (hoveredId !== nextHoveredId) {
        setHoveredId(nextHoveredId)
      }
    }
  }, [basesLocales, hoveredId])

  const onLeave = useCallback(() => {
    if (hoveredId) {
      setHoveredId(null)
    }
  }, [hoveredId])

  const onWheel = useCallback(event => {
    event.stopPropagation()
    if (isZoomActivated) {
      setWarningZoom(false)
    } else {
      setWarningZoom(true)
    }
  }, [isZoomActivated])

  const onDepartementSelect = useCallback(codeDepartement => {
    const as = `/dashboard/departement/${codeDepartement}`

    Router.push({
      pathname: '/dashboard/departement',
      query: {codeDepartement}
    }, as)
  }, [])

  const handleDoubleClick = useCallback(event => {
    event.stopPropagation()
    setIsZoomActivated(!isZoomActivated)
  }, [isZoomActivated])

  const handleClick = useCallback(event => {
    event.stopPropagation()
    const departementsSourceLayer = event.features.find(({sourceLayer}) => sourceLayer === 'departements')

    if (departementsSourceLayer) {
      const {code} = departementsSourceLayer.properties

      onDepartementSelect(code)
    }
  }, [onDepartementSelect])

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
    const getGeoData = async location => {
      const fetchGeoData = await fetch(`/geo/${location}`)
      const response = await fetchGeoData.json()
      setGeoData(response)
    }

    if (departement) {
      getGeoData(`DEP-${departement}`)
    } else {
      setGeoData(defaultGeoData)
    }
  }, [departement])

  useEffect(() => {
    if (departement) {
      setSelectedDepartement(departement)
    }
  }, [departement])

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
    const map = mapRef.current
    map.addEventListener('touchmove', handleMobileTouch)

    return () => {
      map.addEventListener('touchmove', handleMobileTouch)
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
    <div ref={mapRef} className='map-container'>
      <MapGL
        {...viewport}
        touchZoom
        dragPan={!isTouchScreenDevice || isDragPanEnabled}
        width='100%'
        height='100%'
        doubleClickZoom={false}
        scrollZoom={isZoomActivated}
        mapStyle='https://etalab-tiles.fr/styles/osm-bright/style.json'
        getCursor={() => hoveredId ? 'pointer' : 'default'}
        onDblClick={handleDoubleClick}
        onClick={handleClick}
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
            {...departementsLayer}
            id='decoupage-departement-fills'
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
            {hoveredCommune > 0 && (
              <Paragraph>
                {`${hoveredCommune} ${hoveredCommune > 1 ? 'Bases Adresse Locales' : 'Base Adresse Locale'}`}
              </Paragraph>
            )}
          </Popup>
        )}

        {hovered && hoveredId && !hovered.feature.properties.maxStatus && (
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
          </Popup>
        )}
      </MapGL>

      <style jsx>{`
         .map-container {
           width: 100%;
           height: 100%;
           min-height: 300px;
         }
        `}</style>
    </div>
  )
}

Map.defaultProps = {
  departement: null,
  basesLocales: null,
  contours: null
}

Map.propTypes = {
  departement: PropTypes.string,
  basesLocales: PropTypes.array,
  contours: PropTypes.object
}

export default Map
