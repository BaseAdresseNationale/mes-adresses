import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import {Pane, Dialog, Paragraph} from 'evergreen-ui'

import {getBaseLocale, getVoie, getToponyme} from '../lib/bal-api'
import {getCommune} from '../lib/geo-api'

import Fullscreen from '../components/layout/fullscreen'

import Help from '../components/help'

import {LocalStorageContextProvider} from '../contexts/local-storage'
import {HelpContextProvider} from '../contexts/help'
import {TokenContextProvider} from '../contexts/token'
import {BalDataContextProvider} from '../contexts/bal-data'

import useWindowSize from '../hooks/window-size'

import Header from '../components/header'

import ErrorPage from './error'
import Editor from './editor'

function App({error, Component, pageProps, query}) {
  const {innerWidth} = useWindowSize()
  const [isShown, setIsShown] = useState(false)
  const {layout, ...otherPageProps} = pageProps

  useEffect(() => {
    if (innerWidth && innerWidth < 700 && !/(\/dashboard)/.test(location.pathname)) {
      setIsShown(true)
    }
  }, [innerWidth])

  if (error) {
    return (
      <>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <title>mes-adresses.data.gouv.fr</title>
        </Head>

        <ErrorPage statusCode={error.statusCode} />
      </>
    )
  }

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>mes-adresses.data.gouv.fr</title>
      </Head>

      <Pane>
        <Dialog
          isShown={isShown}
          title='Attention'
          confirmLabel='Continuer'
          hasCancel={false}
          onCloseComplete={() => setIsShown(false)}
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

            <Fullscreen flexDirection='column'>
              <>
                <Header />

                {query.balId ? (
                  <BalDataContextProvider balId={query.balId} codeCommune={query.codeCommune} idVoie={query.idVoie} idToponyme={query.idToponyme}>
                    <Editor pageProps={pageProps}>
                      <Component {...otherPageProps} />
                    </Editor>
                  </BalDataContextProvider>
                ) : (
                  <Component {...otherPageProps} />
                )}
              </>
            </Fullscreen>

          </HelpContextProvider>
        </TokenContextProvider>
      </LocalStorageContextProvider>
    </>
  )
}

App.getInitialProps = async ({Component, ctx}) => {
  const {query} = ctx

  let pageProps = {}

  let baseLocale
  let commune
  let voie
  let toponyme

  if (query.balId) {
    try {
      baseLocale = await getBaseLocale(query.balId)
    } catch (error) {
      return {
        pageProps,
        error: {
          statusCode: 404
        }
      }
    }
  }

  if (query.codeCommune) {
    try {
      commune = await getCommune(query.codeCommune, {
        fields: 'contour'
      })
    } catch (error) {
      commune = {
        code: query.codeCommune
      }
    }
  }

  if (query.idVoie) {
    voie = await getVoie(query.idVoie)
  }

  if (query.idToponyme) {
    toponyme = await getToponyme(query.idToponyme)
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({
      ...ctx,
      baseLocale,
      commune,
      voie,
      toponyme
    })
  }

  return {
    pageProps,
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
