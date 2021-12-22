import PropTypes from 'prop-types'
import {Button, Menu, Tooltip, Popover, Position, EditIcon, UploadIcon, CaretDownIcon} from 'evergreen-ui'

function Publication({baseLocale, status, handleBackToDraft, onPublish}) {
  if (baseLocale.communes.length !== 1) {
    return (
      <Tooltip
        position={Position.BOTTOM_RIGHT}
        content={baseLocale.communes.length === 0 ?
          'Votre Base Adresse Locale est vide, ajoutez au moins une commune à votre Base Adresse Locale' :
          'Votre Base Adresse Locale contient plusieurs communes, pour vous authentifier et assurer une publication rapide, adressez-nous le lien de votre Base Adresse Locale à adresse@data.gouv.fr'}
      >
        <Button
          disabled
          marginRight={8}
          height={24}
          appearance='primary'
        >
          Publier
        </Button>
      </Tooltip>
    )
  }

  return (
    status === 'ready-to-publish' ? (
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item icon={UploadIcon} onClick={onPublish}>
                Publier
              </Menu.Item>
              <Menu.Item icon={EditIcon} onClick={handleBackToDraft}>
                Revenir au brouillon
              </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <Button
          appearance='primary'
          marginRight={8}
          height={24}
          iconAfter={CaretDownIcon}
        >
          Publication
        </Button>
      </Popover>
    ) : (
      <Button
        marginRight={8}
        height={24}
        appearance='primary'
        onClick={onPublish}
      >
        Publier
      </Button>
    )
  )
}

Publication.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired
  }).isRequired,
  status: PropTypes.oneOf([
    'draft', 'ready-to-publish'
  ]).isRequired,
  handleBackToDraft: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired
}

export default Publication
