import React from 'react'
import PropTypes from 'prop-types'
import {Badge, Button, Menu, Popover, Position, EditIcon, UploadIcon, CaretDownIcon} from 'evergreen-ui'

function ReadyToPublish({onPublish, onChangeStatus}) {
  return (
    <div>
      <Badge
        color='blue'
        marginRight={8}
        paddingTop={2}
        height={20}
      >
        Prête à être publiée
      </Badge>
      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item icon={UploadIcon} onClick={onPublish}>
                Publier
              </Menu.Item>
              <Menu.Item icon={EditIcon} onClick={onChangeStatus}>
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
    </div>
  )
}

ReadyToPublish.propTypes = {
  onPublish: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired
}

export default React.memo(ReadyToPublish)
