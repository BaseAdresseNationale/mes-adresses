import {useState, useCallback, useRef, useEffect} from 'react'
import {useRouter} from 'next/router'
import PropTypes from 'prop-types'
import MapGL, {Source, Layer, Popup, WebMercatorViewport} from 'react-map-gl'
import {Paragraph, Heading, Alert} from 'evergreen-ui'

import {colors} from '../../lib/colors'

const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

const defaultViewport = {
  latitude: 46.9,
  longitude: 1.7,
  zoom: 4
}

const defaultBbox = [-5.317, 41.277, 9.689, 51.234]

function Map({departement, basesLocales}) {
  const [viewport, setViewport] = useState(defaultViewport)
  const [hovered, setHovered] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [warningZoom, setWarningZoom] = useState(false)
  const [isZoomActivated, setIsZoomActivated] = useState(false)
  const [isTouchScreenDevice, setIsTouchScreenDevice] = useState(false)
  const [isDragPanEnabled, setIsDragPanEnabled] = useState(false)
  const [hoveredCommune, setHoveredCommune] = useState(null)

  const router = useRouter()

  const mapRef = useRef()

  const balLayer = {
    type: 'fill',
    'source-layer': 'communes',
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'maxStatus'], 'published'],
        colors.green,
        ['==', ['get', 'maxStatus'], 'replaced'],
        colors.red,
        ['==', ['get', 'maxStatus'], 'published-other'],
        colors.purple,
        ['==', ['get', 'maxStatus'], 'ready-to-publish'],
        colors.blue,
        ['==', ['get', 'maxStatus'], 'draft'],
        colors.neutral,
        '#696f8c'
      ],
      'fill-opacity': [
        'case',
        ['==', ['get', 'code'], hoveredId ? hoveredId : null],
        1,
        0.8
      ],
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
        ['==', ['get', 'code'], departement ? departement : null],
        0.5,
        ['==', ['get', 'code'], hoveredId ? hoveredId : null],
        0.8,
        0.3
      ],
      'fill-outline-color': '#000'
    },
    filter: ['!=', 'code', departement || '']
  }

  const onHover = event => {
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
  }

  const onLeave = () => {
    if (hoveredId) {
      setHoveredId(null)
    }
  }

  const onWheel = event => {
    event.stopPropagation()
    if (isZoomActivated) {
      setWarningZoom(false)
    } else {
      setWarningZoom(true)
    }
  }

  const onDepartementSelect = codeDepartement => {
    router.push({
      pathname: '/dashboard/departement',
      query: {codeDepartement}
    }, `/dashboard/departement/${codeDepartement}`)
  }

  const handleDoubleClick = event => {
    event.stopPropagation()
    setIsZoomActivated(!isZoomActivated)
  }

  const handleClick = event => {
    event.stopPropagation()
    const departementsSourceLayer = event.features.find(({sourceLayer}) => sourceLayer === 'departements')

    if (departementsSourceLayer) {
      const {code} = departementsSourceLayer.properties

      onDepartementSelect(code)
    }
  }

  const handleResize = useCallback((bbox = defaultBbox) => {
    if (mapRef && mapRef.current) {
      const width = mapRef.current.offsetWidth
      const height = mapRef.current.offsetHeight

      const padding = width > 50 && height > 50 ? 20 : 0
      const viewport = new WebMercatorViewport({width, height})
        .fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding})

      setViewport(viewport)
    }
  }, [mapRef])

  useEffect(() => {
    const getGeoData = async location => {
      const fetchGeoData = await fetch(`/geo/${location}`)
      const {bbox} = await fetchGeoData.json()

      handleResize(bbox)
    }

    if (departement) {
      getGeoData(`DEP-${departement}`)
    } else {
      handleResize(defaultBbox)
    }
  }, [departement, handleResize])

  useEffect(() => {
    if (warningZoom) {
      const timer = setTimeout(() => setWarningZoom(false), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [warningZoom])

  useEffect(() => {
    const map = mapRef.current

    const handleMobileTouch = event => {
      event.stopPropagation()
      const {touches} = event
      if (touches.length > 1) {
        setIsDragPanEnabled(true)
      } else {
        setIsDragPanEnabled(false)
      }
    }

    setIsTouchScreenDevice('ontouchstart' in document.documentElement)

    map.addEventListener('touchmove', handleMobileTouch)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      map.addEventListener('touchmove', handleMobileTouch)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={mapRef} className='map-container'>
      <MapGL
        {...viewport}
        touchZoom
        dragPan={!isTouchScreenDevice || isDragPanEnabled}
        width='100%'
        height='100%'
        minZoom={4}
        maxZoom={14}
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
            source='decoupage-administratif'
            beforeId='place-town'
          />
        </Source>

        <Source
          id='bal'
          type='vector'
          format='pbf'
          tiles={[`${BAL_API_URL}/stats/couverture-tiles/{z}/{x}/{y}.pbf`]}
        >
          <Layer id='bal-fill' {...balLayer} beforeId='departements-fill' />
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
