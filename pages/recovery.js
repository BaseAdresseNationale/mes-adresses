import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import {Pane, Heading, Spinner} from 'evergreen-ui'

import {storeBalAccess} from '../lib/tokens'

import Header from '../components/header'

const MES_ADRESSES = '//localhost:8000'

const RetrieveBALAccessComponent = dynamic(() => import('../components/retrieve-bal-acccess'), {
  ssr: false
})

function Index({recoveredBals}) {
  const router = useRouter()
  const [bals, setBals] = useState()

  useEffect(() => {
    if (recoveredBals) {
      Object.keys(recoveredBals).forEach(id => {
        storeBalAccess(id, recoveredBals[id])
      })

      router.push('/')
    }
  }, [recoveredBals, router])

  useEffect(() => {
    if (!recoveredBals && bals) {
      if (Object.keys(bals).length === 0) {
        setTimeout(() => {
          router.push(MES_ADRESSES)
        }, 3000)
      } else {
        const query = Object.entries(bals).map(pair => pair.map(encodeURIComponent).join('=')).join('&')
        const url = `${MES_ADRESSES}/recovery?${query}`

        router.push(url)
      }
    }
  }, [bals, recoveredBals, router])

  return (
    <Pane display='flex' flexDirection='column' height='100%'>
      <Header />

      {!recoveredBals && <RetrieveBALAccessComponent handleBals={setBals} />}

      <Pane height='100%' display='flex' flexDirection='column' flex={1} alignItems='center' justifyContent='center'>
        <Spinner />
        <Heading marginTop={16}>{bals && Object.keys(bals).length === 0 ?
          'Aucune Base Adresse Locale n’a été trouvée' :
          'Récupération de vos Bases Adresses Locales'}
        </Heading>
      </Pane>
    </Pane>
  )
}

Index.defaultProps = {
  recoveredBals: null
}

Index.propTypes = {
  recoveredBals: PropTypes.object
}

Index.getInitialProps = async ({query}) => {
  console.log(query)
  return {
    recoveredBals: Object.keys(query).length > 0 ? query : null,
    layout: 'fullscreen'
  }
}

export default Index
