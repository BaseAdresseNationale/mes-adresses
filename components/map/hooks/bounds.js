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

  const setBoundsItem = useCallback(item => {
    if (map && item && item.trace) {
      setBounds(bbox(item.trace))
    } else if (map && item && item.bbox) {
      setBounds(item.bbox)
    }
  }, [map, setBounds])

  useEffect(() => { // Get bounds on page load and when edit
    const {idVoie, idToponyme} = router.query
    const bounds = communeBounds

    if (isTileSourceLoaded) {
      if (idVoie) {
        setBoundsItem(voie)
      } else if (idToponyme) {
        setBoundsItem(toponyme)
      } else if (editingItem) {
        setBoundsItem(editingItem)
      } else {
        setBounds(bounds)
      }
    }
  }, [communeBounds, router.query, isTileSourceLoaded, voie, toponyme, editingItem, setBoundsItem])

  return bounds
}

export default useBounds
