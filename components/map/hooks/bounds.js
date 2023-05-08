import {useMemo, useContext, useState, useEffect, useCallback} from 'react'
import bbox from '@turf/bbox'

import BalDataContext from '@/contexts/bal-data'
import MapContext from '@/contexts/map'
import {useRouter} from 'next/router'

function useBounds(commune, voie, toponyme) {
  const communeBounds = useMemo(() => commune.contour ? bbox(commune.contour) : null, [commune.contour])
  const {editingItem} = useContext(BalDataContext)
  const {map, isTileSourceLoaded} = useContext(MapContext)
  const [bounds, setBounds] = useState(communeBounds)

  const router = useRouter()

  const getBoundsItem = useCallback(item => {
    if (map && isTileSourceLoaded && item && item.bbox) {
      return item.bbox
    }

    return communeBounds
  }, [map, isTileSourceLoaded, communeBounds])

  useEffect(() => { // Get bounds on page load and when edit
    const {idVoie, idToponyme} = router.query
    let bounds = communeBounds

    if (isTileSourceLoaded) {
      if (idVoie) {
        bounds = getBoundsItem(voie)
      } else if (idToponyme) {
        bounds = getBoundsItem(toponyme)
      } else if (editingItem) {
        bounds = getBoundsItem(editingItem)
      }
    }

    setBounds(bounds)
  }, [communeBounds, router.query, isTileSourceLoaded, voie, toponyme, editingItem, getBoundsItem])

  return bounds
}

export default useBounds
