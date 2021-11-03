import React, {useMemo, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Badge, Button, Alert, Dialog, Pane, Paragraph, Strong, Link, DownloadIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, getCommune} from '../../../lib/bal-api'

function Draft({baseLocaleId, codeCommune, isDialogDisplayed, onOpenDialog, onCloseDialog, onPublish}) {
  const [isBALCertified, setIsBALCertified] = useState(false)

  const csvUrl = useMemo(() => {
    return getBaseLocaleCsvUrl(baseLocaleId)
  }, [baseLocaleId])

  useEffect(() => {
    async function fectCommune() {
      const communeBAL = await getCommune(baseLocaleId, codeCommune)
      const {nbNumeros, nbNumerosCertifies} = communeBAL

      setIsBALCertified(nbNumeros === nbNumerosCertifies)
    }

    fectCommune()
  }, [baseLocaleId, codeCommune, setIsBALCertified])

  return (
    <div>
      <Dialog
        isShown={isDialogDisplayed}
        title='Félicitations, vous y êtes presque &nbsp; 🎉'
        intent='success'
        confirmLabel='Publier'
        cancelLabel='Plus tard'
        onConfirm={onPublish}
        onCloseComplete={onCloseDialog}
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
        onClick={onOpenDialog}
      >
        Publier
      </Button>
    </div>
  )
}

Draft.propTypes = {
  baseLocaleId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  isDialogDisplayed: PropTypes.bool.isRequired,
  onOpenDialog: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired
}

export default React.memo(Draft)
