import PropTypes from 'prop-types'
import Link from 'next/link'
import {Pane, Alert, Text, Icon, ArrowLeftIcon} from 'evergreen-ui'

function Error404({hasRedirection}) {
  return (
    <Alert title='Votre Base Adresse Locale est introuvable' intent='warning'>
      <Pane display='flex' flexDirection='column'>
        <Text marginBottom='1em'>Si votre Base Adresse Locale a été créée sans être publiée <strong>avant le 15 mars 2021</strong> celle-ci a malheureusement été <strong>perdue</strong> en raison d’un incendie ayant affecté le centre de données hébergeant notre infrastructure.</Text>
        {hasRedirection && (
          <Text>
            <Link href='/'><a><Icon icon={ArrowLeftIcon} style={{verticalAlign: 'middle'}} marginRight={4} /> Retour à la page d’accueil</a></Link>
          </Text>
        )}
      </Pane>
    </Alert>
  )
}

Error404.defaultProps = {
  hasRedirection: false,
}

Error404.propTypes = {
  hasRedirection: PropTypes.bool,
}

export default Error404
