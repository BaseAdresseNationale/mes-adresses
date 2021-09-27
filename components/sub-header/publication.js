import React, {useMemo, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'
import {Badge, Button, Alert, Dialog, Menu, Pane, Popover, Tooltip, Paragraph, Position, Strong, Link, DownloadIcon, EditIcon, UploadIcon, CaretDownIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, getCommune} from '../../lib/bal-api'

const Publication = ({token, baseLocale, commune, status, onChangeStatus, onPublish}) => {
  const [isShown, setIsShown] = useState(false)
  const [noBal, setNoBal] = useState(false)
  const [multiBal, setMultiBal] = useState(false)
  const [isBALCertified, setIsBALCertified] = useState(false)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)

  const editTip = useMemo(() => css({
    '@media (max-width: 700px)': {
      marginLeft: -10,

      '& > span': {
        display: 'none'
      }
    }
  }), [])

  const handleDialogs = () => {
    if (baseLocale.communes.length === 0) {
      setNoBal(true)
    } else if (baseLocale.communes.length > 1) {
      setMultiBal(true)
    } else {
      setIsShown(true)
    }
  }

  useEffect(() => {
    async function fetchCommune() {
      const communeBAL = await getCommune(baseLocale._id, commune.code)
      const {nbNumeros, nbNumerosCertifies} = communeBAL
      setIsBALCertified(nbNumeros === nbNumerosCertifies)
    }

    if (baseLocale?._id && commune?.code) {
      fetchCommune()
    }
  }, [baseLocale, commune])

  if (!token) {
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
            <Pane marginTop={4}>
              <Strong>Votre Base Adresse Locale est maintenant &nbsp;</Strong>
              <Badge
                color='blue'
                marginRight={8}
                paddingTop={2}
                height={20}
              >
                Prête à être publiée
              </Badge>
              <Paragraph>Vous pouvez dès maintenant publier vos adresses afin de mettre à jour la Base Adresse Nationale.</Paragraph>
              <Paragraph>Une fois la publication effective, il vous sera toujours possible de modifier vos adresses afin de les mettre à jour.</Paragraph>
              {!isBALCertified && (
                <Alert
                  intent='warning'
                  title='Toutes vos adresses ne sont pas certifiées'
                  marginY={16}
                >
                  Nous vous recommandons de certifier la totalité de vos adresses.
                  Une adresse certifiée est déclarée authentique par la mairie, ce qui renforce la qualité de la Base Adresse Locale et facilite sa réutilisation.
                  Vous êtes cependant libre de publier maintenant et certifier vos adresses plus tard.
                  Notez qu’il est possible de certifier la totalité de vos adresses depuis le menu « Paramètres ».
                </Alert>
              )}
            </Pane>
            <Link href={csvUrl} display='flex' marginTop='1em'>
              Télécharger vos adresses au format CSV
              <DownloadIcon marginLeft='.5em' marginTop='3px' />
            </Link>
          </Dialog>

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
            onClick={handleDialogs}
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
  baseLocale: PropTypes.object.isRequired,
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
