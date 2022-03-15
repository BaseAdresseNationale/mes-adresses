import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Heading, Text, Spinner} from 'evergreen-ui'

const Index = React.memo(({baseLocale}) => {
  const router = useRouter()

  useEffect(() => {
    const [codeCommume] = baseLocale.communes

    router.push(
      `/bal/commune?balId=${baseLocale._id}&codeCommune=${codeCommume}`,
      `/bal/${baseLocale._id}/communes/${codeCommume}`
    )
  }, [router, baseLocale])

  return (
    <>
      <Pane
        display='flex'
        flexDirection='column'
        background='tint1'
        padding={16}
      >
        <Heading>{baseLocale.nom}</Heading>
      </Pane>
      <Pane display='flex' flex={1} alignItems='center' justifyContent='center'>
        <Pane display='flex' flexDirection='column' alignItems='center'>
          <Spinner size={80} marginBottom={16} />
          <Text>Chargement de la commune…</Text>
        </Pane>
      </Pane>
    </>
  )
})

Index.getInitialProps = async ({baseLocale}) => {
  return {
    layout: 'sidebar',
    baseLocale
  }
}

Index.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired
  }).isRequired
}

export default Index
