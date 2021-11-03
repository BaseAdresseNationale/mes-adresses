import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'
import {Button, Dialog, Tooltip, Paragraph, Position, EditIcon} from 'evergreen-ui'

import Published from './publication/published'
import ReadyToPublish from './publication/ready-to-publish'
import Draft from './publication/draft'

function Publication({isAdmin, baseLocale, commune, status, onChangeStatus, onPublish}) {
  const [isPublicationDialogDisplayed, setIsPublicationDialogDisplayed] = useState(false)
  const [noBal, setNoBal] = useState(false)
  const [multiBal, setMultiBal] = useState(false)

  const editTip = useMemo(() => css({
    '@media (max-width: 700px)': {
      marginLeft: -10,

      '& > span': {
        display: 'none'
      }
    }
  }), [])

  const handleOpenDialogs = () => {
    if (baseLocale.communes.length === 0) {
      setNoBal(true)
    } else if (baseLocale.communes.length > 1) {
      setMultiBal(true)
    } else {
      setIsPublicationDialogDisplayed(true)
    }
  }

  const handleClosePublicationDialog = () => {
    setIsPublicationDialogDisplayed(false)
    onChangeStatus()
  }

  if (!isAdmin) {
    return (
      <Tooltip
        content='Vous n’êtes pas identifié comme administrateur de cette base adresse locale, vous ne pouvez donc pas l’éditer.'
        position={Position.BOTTOM_RIGHT}
      >
        <Button height={24} marginRight={8} appearance='primary' intent='danger' iconBefore={EditIcon}>
          <div className={editTip}><span>Édition impossible</span></div>
        </Button>
      </Tooltip>
    )
  }

  return (
    status === 'ready-to-publish' ? (
      <ReadyToPublish onPublish={onPublish} onChangeStatus={onChangeStatus} />
    ) : (status === 'published' ? (
      <Published />
    ) : (
      <div>
        <Draft
          baseLocaleId={baseLocale._id}
          codeCommune={commune.code}
          isDialogDisplayed={isPublicationDialogDisplayed}
          onOpenDialog={handleOpenDialogs}
          onCloseDialog={handleClosePublicationDialog}
          onPublish={onPublish}
        />

        <Dialog
          isShown={noBal}
          hasFooter={false}
          title='Votre Base Adresse Locale est vide'
          onCloseComplete={() => setNoBal(false)}
        >
          <Paragraph>Merci d’ajouter au moins une commune à votre Base Adresse Locale.</Paragraph>
        </Dialog>

        <Dialog
          isShown={multiBal}
          hasFooter={false}
          title='Votre Base Adresse Locale contient plusieurs communes'
          onCloseComplete={() => setMultiBal(false)}
        >
          <Paragraph>Pour vous authentifier et assurer une publication rapide, adressez-nous le lien de votre Base Adresse Locale à <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a></Paragraph>
        </Dialog>
      </div>
    ))
  )
}

Publication.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired,
  status: PropTypes.oneOf([
    'draft', 'ready-to-publish', 'published', 'demo'
  ]).isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired
}

export default Publication
