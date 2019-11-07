import React, {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'

import {Badge, Button, Dialog, Menu, Popover, Tooltip, Paragraph, Position} from 'evergreen-ui'

const Publication = ({token, status, onChangeStatus, onPublish}) => {
  const [isShown, setIsShown] = useState(false)

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
      ) : status === 'published' ? (
        <Tooltip
          position={Position.BOTTOM_LEFT}
          content="Votre BAL est désormais publiée ! Pour la mettre à jour, il vous suffit de l'éditer ici et les changements seront appliqués d'ici quelques jours"
        >
          <Badge
            color='green'
            marginRight={8}
            paddingTop={2}
            height={20}
          >
            Publiée
          </Badge>
        </Tooltip>
      ) : (
        <div>
          <Dialog
            isShown={isShown}
            title='Félicitations, vous y êtes presque &nbsp; 🎉'
            intent='success'
            confirmLabel='Publier'
            cancelLabel='Plus tard'
            onConfirm={onPublish}
            onCloseComplete={() => {
              setIsShown(false)
              onChangeStatus()
            }}
          >
            <Paragraph marginTop='default'>
              <b>Votre Base Adresse Locale est maintenant &nbsp;</b>
              <Badge
                color='blue'
                marginRight={8}
                marginBottom={20}
                paddingTop={2}
                height={20}
              >
                Prête à être publiée
              </Badge>
              <br />{}Vous pouvez dès maintenant publier vos adresses afin de mettre à jour la Base Adresse Nationale.
              <br />{}Une fois la publication effective, il vous sera toujours possible de modifier vos adresses afin de les mettre à jour.
            </Paragraph>
          </Dialog>
          <Badge
            marginRight={8}
            paddingTop={2}
            height={20}
          >
            Brouillon
          </Badge>
          <Button
            marginRight={8}
            height={24}
            appearance='primary'
            onClick={setIsShown}
          >
            Publier
          </Button>
        </div>
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
