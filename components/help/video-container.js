import PropTypes from 'prop-types'
import {Pane, Heading, Paragraph, VideoIcon} from 'evergreen-ui'
import Link from 'next/link'

const TUBE_LINK = 'https://peertube.adresse.data.gouv.fr'

function VideoContainer({title, link}) {
  // Extract code to use embed video
  const embedCode = link.replace(`${TUBE_LINK}/w/`, '')

  return (
    <Pane
      backgroundColor='white'
      elevation={1}
      display='flex'
      flexDirection='column'
      marginTop={8}
      marginBottom={16}
      padding={16}
    >
      {title && (
        <Heading size={600} marginY={16}>
          {title}
        </Heading>
      )}
      <iframe
        title='Création d’une Base Adresse Locale'
        src={`${TUBE_LINK}/videos/embed/${embedCode}?warningTitle=0`}
        height='315px'
        width='100%'
        frameBorder='0'
        sandbox='allow-same-origin allow-scripts'
        allowFullScreen='allowfullscreen'
      />
      <Paragraph paddingTop={10}>
        <VideoIcon paddingRight={5} verticalAlign='middle' size={25} />
        <Link href={TUBE_LINK}>
          Retouvez tous les tutoriels vidéos
        </Link>
      </Paragraph>
    </Pane>
  )
}

VideoContainer.defaultProps = {
  title: null
}

VideoContainer.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string.isRequired
}

export default VideoContainer
