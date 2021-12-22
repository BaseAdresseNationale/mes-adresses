import PropTypes from 'prop-types'
import NextImage from 'next/image'
import {Pane, Text, Strong} from 'evergreen-ui'

function AuthenticatedUser({type, title, subtitle}) {
  return (
    <Pane display='flex' flexDirection='column' textAlign='center' gap={8}>
      <NextImage width={66} height={66} src={`/static/images/${type}.svg`} alt={`logo ${type}`} />
      <Pane>
        <Text is='div'>{title}</Text>
        <Text><Strong>{subtitle}</Strong></Text>
      </Pane>
    </Pane>
  )
}

AuthenticatedUser.propTypes = {
  type: PropTypes.oneOf(['elu', 'mairie']).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired
}

export default AuthenticatedUser
