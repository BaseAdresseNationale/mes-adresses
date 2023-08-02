import PropTypes from 'prop-types'
import {Button, Menu, Popover, Position, EditIcon, UploadIcon, CaretDownIcon} from 'evergreen-ui'

function Publication({status, handleBackToDraft, onPublish}) {
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
  status: PropTypes.oneOf([
    'draft', 'ready-to-publish', 'published', 'replaced'
  ]).isRequired,
  handleBackToDraft: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired
}

export default Publication
