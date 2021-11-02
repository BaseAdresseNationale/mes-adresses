import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Heading, Button, Icon, ArrowLeftIcon, ErrorIcon, Alert, Text} from 'evergreen-ui'

import Header from '../components/header'

import Custom404 from './404'

function CustomError({statusCode}) {
  const router = useRouter()

  if (statusCode === 404) {
    return <Custom404 />
  }

  return (
    <Pane display='flex' backgroundColor='#fff' flexDirection='column' width='100%' height='100%'>
      <Header />
      <Pane
        display='flex'
        alignItems='center'
        flexDirection='column'
        justifyContent='center'
        height='50%'
      >
        <Icon icon={ErrorIcon} size={100} marginX='auto' marginY={16} color='#101840' />
        <Heading size={800} marginBottom='2em'>Erreur {statusCode} - Une erreur est survenue</Heading>
        <Alert intent='danger' title='Merci de contacter notre support' marginBottom={16}>
          <Text>
            Si vous rencontrez cette page, merci de le signaler à notre support à l’adresse courriel : <a href={`mailto:adresse@data.gouv.fr?subject=Une erreur est survenue - code ${statusCode}`}>adresse@data.gouv.fr</a>. Nous vous prions de bien vouloir nous excuser pour la gêne occasionnée.
          </Text>
        </Alert>

        <Button iconBefore={ArrowLeftIcon} onClick={() => router.push('/')}>
          Retour à la page d’accueil
        </Button>
      </Pane>
    </Pane>
  )
}

CustomError.propTypes = {
  statusCode: PropTypes.number.isRequired
}

CustomError.getInitialProps = ({res, err}) => {
  const statusCode = res ? res.statusCode : (err ? err.statusCode : 404)
  return {statusCode}
}

export default CustomError
