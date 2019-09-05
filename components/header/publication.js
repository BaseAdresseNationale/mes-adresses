import React, {useMemo} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'

import {Button, Menu, Popover, Tooltip, Position} from 'evergreen-ui'

const Publication = ({token, status, onChangeStatus, onPublish}) => {
  const editTip = useMemo(() => css({
    '@media (max-width: 700px)': {
      marginLeft: -10,

      '& > span': {
        display: 'none'
      }
    }
  }), [])

  if (!token) {
    return (
      <Tooltip
        content='Vous n’êtes pas identifié comme administrateur de cette base adresse locale, vous ne pouvez donc pas l’éditer.'
        position={Position.BOTTOM_RIGHT}
      >
        <Button height={24} marginRight={8} appearance='primary' intent='danger' iconBefore='edit'>
          <div className={editTip}><span>Édition impossible</span></div>
        </Button>
      </Tooltip>
    )
  }

  return (
    <>
      {status === 'ready-to-publish' ? (
        <div>
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <Menu.Group>
                  <Menu.Item icon='upload' onClick={onPublish}>
                    Publier
                  </Menu.Item>
                  <Menu.Item icon='edit' onClick={onChangeStatus}>
                    Revenir au brouillon
                  </Menu.Item>
                </Menu.Group>
              </Menu>
            }
          >
            <Button
              intent='info'
              appearance='primary'
              marginRight={8}
              height={24}
              iconAfter='caret-down'
            >
              Publication
            </Button>
          </Popover>
        </div>
      ) : (
        <Button marginRight={8} height={24} appearance='primary' onClick={onChangeStatus}>
          {status === 'published' ? 'Mettre à jour' : 'Prêt à être publié' }
        </Button>
      )}
    </>
  )
}

Publication.defaultProps = {
  token: null
}

Publication.propTypes = {
  token: PropTypes.string,
  status: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired
}

export default Publication
