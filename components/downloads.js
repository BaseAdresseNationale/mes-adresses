import PropTypes from 'prop-types'
import {
  Pane,
  Heading,
  Link,
  DownloadIcon
} from 'evergreen-ui'
import {getBaseLocaleCsvUrl, getListVoiesCsvUrl} from '@/lib/bal-api'

function Downloads({baseLocale}) {
  const csvBalUrl = getBaseLocaleCsvUrl(baseLocale._id)
  const csvVoiesUrl = getListVoiesCsvUrl(baseLocale._id)

  return (
    <Pane>
      <Pane
        flexShrink={0}
        elevation={0}
        background='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane display='flex' alignItems='center'>
          <DownloadIcon />
          <Heading paddingLeft={5}>Téléchargements</Heading>
        </Pane>
      </Pane>
      <Pane
        is='ul'
        display='flex'
        flexDirection='column'
        overflowY='scroll'
      >
        <Pane is='li' marginBottom={10}>
          <Link href={csvBalUrl}>Base Adresse Locale (format CSV)</Link>
        </Pane>
        <Pane is='li' marginBottom={10}>
          <Link href={csvVoiesUrl}>Liste des voies (format CSV)</Link>
        </Pane>
      </Pane>
    </Pane>
  )
}

Downloads.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired
}

export default Downloads
