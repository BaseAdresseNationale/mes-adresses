import {useState} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import {Pane, Dialog, Paragraph} from 'evergreen-ui'

import 'mapbox-gl/dist/mapbox-gl.css'

import {getCommune as getGeoCommune} from '@/lib/geo-api'
import {getBaseLocale, getCommune, getVoies, getToponymes} from '@/lib/bal-api'

import {LocalStorageContextProvider} from '@/contexts/local-storage'
import {HelpContextProvider} from '@/contexts/help'
import {TokenContextProvider} from '@/contexts/token'

import ErrorPage from '@/pages/_error'

import Editor from '@/layouts/editor'

import Header from '@/components/header'
import IEWarning from '@/components/ie-warning'
import Help from '@/components/help'

function App({error, Component, pageProps, query}) {
  const [isMobileWarningDisplayed, setIsMobileWarningDisplayed] = useState(false)

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>mes-adresses.data.gouv.fr</title>
      </Head>

      <Pane>
        <Dialog
          isShown={isMobileWarningDisplayed}
          title='Attention'
          confirmLabel='Continuer'
          hasCancel={false}
          onCloseComplete={() => setIsMobileWarningDisplayed(false)}
        >
          <Paragraph marginTop='default'>
            Afin de profiter d’une meilleure expérience, il est recommandé d’utiliser cet outil sur un écran plus grand 🖥
          </Paragraph>
          <Paragraph marginTop='default'>
            Une version mobile est en cours de développement pour toujours avoir sa Base Adresse Locale à portée de main 💪🏻
          </Paragraph>
          <Paragraph marginTop='default'>
            Merci de votre patience 🙏
          </Paragraph>
        </Dialog>
      </Pane>

      <LocalStorageContextProvider>
        <TokenContextProvider balId={query.balId} _token={query.token}>
          <HelpContextProvider>

            <Help />

            <Pane height='100%' width='100%' display='flex' flexDirection='column'>
              <Header />
              {error ? (
                <ErrorPage statusCode={error.statusCode} />
              ) : (
                <>
                  <IEWarning />
                  {query.balId ? (
                    <Editor {...pageProps}>
                      <Component {...pageProps} />
                    </Editor>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </>
              )}
            </Pane>
          </HelpContextProvider>
        </TokenContextProvider>
      </LocalStorageContextProvider>
      {/* ⚠️ This is needed to expand Evergreen’Tootip width
      It select all Tooltip components with 'appearance: card' propertie */}
      <style jsx global>{`
        div[id^="evergreen-tooltip"].ub-max-w_240px.ub-bg-clr_white.ub-box-szg_border-box {
          max-width: fit-content;
        }
      `}</style>
    </>
  )
}

App.getInitialProps = async ({Component, ctx}) => {
  const {query} = ctx

  let pageProps = {}

  let baseLocale
  let commune
  let voies
  let toponymes

  try {
    if (query.balId) {
      baseLocale = await getBaseLocale(query.balId)

      const [codeCommune] = baseLocale.communes
      if (query.codeCommune && query.codeCommune !== codeCommune) {
        throw new Error('La commune demandée ne fais pas partie de la Base Adresse Locale')
      }

      const baseLocaleCommune = await getCommune(query.balId, codeCommune)
      const geoCommune = await getGeoCommune(codeCommune, {
        fields: 'contour'
      })

      commune = {...baseLocaleCommune, ...geoCommune}
      voies = await getVoies(query.balId, codeCommune)
      toponymes = await getToponymes(query.balId, codeCommune)
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
        baseLocale,
        commune,
        voies,
        toponymes
      })
    }
  } catch {
    return {
      pageProps,
      error: {
        statusCode: 404
      }
    }
  }

  return {
    pageProps: {
      baseLocale,
      commune,
      voies,
      toponymes,
      ...pageProps
    },
    query
  }
}

App.propTypes = {
  error: PropTypes.shape({
    statusCode: PropTypes.number
  }),
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
  query: PropTypes.object,
  geojson: PropTypes.object
}

App.defaultProps = {
  query: {},
  error: null,
  geojson: null
}

export default App
