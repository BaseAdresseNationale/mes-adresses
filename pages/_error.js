import PropTypes from 'prop-types'
import Link from 'next/link'
import {Pane, Heading, Button, Icon, ArrowLeftIcon, ErrorIcon, Alert, Text} from 'evergreen-ui'

import Main from '@/layouts/main'

import Custom404 from '@/pages/404'

function CustomError({statusCode}) {
  if (statusCode === 404) {
    return <Custom404 />
  }

  return (
    <Main>
      <Pane
        display='flex'
        flex={1}
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
        <Link href='/' passHref legacyBehavior>
          <Button iconBefore={ArrowLeftIcon} is='a'>
            Retour à la page d’accueil
          </Button>
        </Link>
      </Pane>
    </Main>
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
