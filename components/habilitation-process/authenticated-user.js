import PropTypes from 'prop-types'
import NextImage from 'next/legacy/image'
import {Pane, Text, Strong} from 'evergreen-ui'

function AuthenticatedUser({type, title, subtitle}) {
  return (
    <Pane display='flex' flexDirection='column' alignItems='center' gap={8}>
      <Pane borderRadius='50%' height={90} width={90} border='solid 1px #E5E5E5' display='flex' justifyContent='center' alignItems='center'>
        <NextImage width={66} height={66} src={`/static/images/${type}.svg`} alt={`logo ${type}`} />
      </Pane>
      <Text is='div' fontSize='18px' display='flex' flexWrap='wrap' justifyContent='center'>Vous êtes identifié comme :&nbsp;<Strong fontSize='18px'> {title} {subtitle}</Strong></Text>
    </Pane>
  )
}

AuthenticatedUser.propTypes = {
  type: PropTypes.oneOf(['elu', 'mairie']).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
}

export default AuthenticatedUser
