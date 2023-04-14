import {useEffect, useState} from 'react'

export default function useMatomoTracker({siteId, trackerUrl, trackingEnabled}, pageProps) {
  const [matomoState, setMatomoState] = useState(null)

  // Load matomo script
  useEffect(() => {
    if (!trackingEnabled) {
      return
    }

    const matomoScriptElem = document.createElement('script')
    const firstScriptElem = document.querySelectorAll('script')[0]
    matomoScriptElem.async = true
    matomoScriptElem.src = `${trackerUrl}matomo.js`
    matomoScriptElem.addEventListener('load', () => {
      setMatomoState('loaded')
    })

    firstScriptElem.parentNode.insertBefore(matomoScriptElem, firstScriptElem)
  }, [trackerUrl, trackingEnabled])

  // Init matomo tracker with site configuration
  useEffect(() => {
    if (matomoState === 'loaded') {
      window.Matomo.addTracker()
      window._paq.push(['setTrackerUrl', `${trackerUrl}matomo.php`], ['setSiteId', `${siteId}`])
      setMatomoState('initialized')
    }
  }, [matomoState, trackerUrl, siteId])

  // Track pages when pageProps change
  useEffect(() => {
    if (matomoState === 'initialized') {
      const {commune} = pageProps
      let urlToTrack = location.href
      const balEditorPageRe = /\/bal\/.*/
      const isOnBalEditor = balEditorPageRe.test(location.pathname)
      if (isOnBalEditor) {
        // Prevent the tracker from tracking the bal page and children
        const pageWithTokenPathRE = /\/bal\/[A-Za-z\d]{24}\/[A-Za-z\d]{20}/
        const isOnTokenRoute = pageWithTokenPathRE.test(location.pathname)
        if (isOnTokenRoute || !commune) {
          return
        }

        // Replace the balId by the commune code if we are on the bal editor page
        const pathToTrack = location.pathname.split('/').map((pathPart, index) => index === 2 ? commune.code : pathPart).join('/')
        urlToTrack = `${location.origin}${pathToTrack}`
      }

      window._paq.push(['setCustomUrl', urlToTrack], ['trackPageView'])
    }
  }, [matomoState, pageProps])
}
