import PropTypes from 'prop-types'
import {Dialog, Pane, Paragraph, Strong, VideoIcon} from 'evergreen-ui'

import {PEERTUBE_LINK} from '@/components/help/video-container'

function MassDeletionDialog({isShown, handleConfirm, handleCancel}) {
  return (
    <Dialog
      isShown={isShown}
      intent='danger'
      title='⚠️ Un très grand nombre d’adresses a été supprimé'
      cancelLabel='Annuler'
      confirmLabel='Continuer'
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <Pane>
        <Paragraph>Vous avez <Strong>supprimé au moins 50% des adresses</Strong> connues actuellement dans la Base Adresse Nationale.</Paragraph>
        <Paragraph marginTop={8}>Nous vous rappelons que la publication de vos adresses doit se faire sur <Strong>la totalité de la commune</Strong>.</Paragraph>

        <Paragraph marginTop={8}>Si vous éprouvez des difficultés à utiliser notre outil et souhaitez être accompagné, <Strong>vous pouvez nous contacter à l’adresse <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a></Strong></Paragraph>
        <Paragraph marginTop={8}>Des <a href={PEERTUBE_LINK}><VideoIcon size={12} /> tutoriels vidéo</a> sont également disponibles afin de vous accompagner lors de vos travaux d’adressage.</Paragraph>
      </Pane>
    </Dialog>
  )
}

MassDeletionDialog.propTypes = {
  isShown: PropTypes.bool.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
}

export default MassDeletionDialog
