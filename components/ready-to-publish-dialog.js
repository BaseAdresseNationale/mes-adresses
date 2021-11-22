import {useState, useEffect, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Strong, Badge, Text, Link, Alert, DownloadIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, getCommune} from '../lib/bal-api'

function ReadyToPublishDialog({baseLocaleId, codeCommune}) {
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
    <>
      <Pane>
        <Pane marginBottom={16}>
          <Strong>Votre Base Adresse Locale est maintenant &nbsp;</Strong>
          <Badge
            color='blue'
            marginRight={8}
            paddingTop={2}
            height={20}
          >
            Prête à être publiée
          </Badge>
        </Pane>

        <Text is='div'>
          Vous pouvez dès maintenant publier vos adresses afin de <Strong>mettre à jour la Base Adresse Nationale</Strong>.
        </Text>
        <Text is='div' marginTop={8}>
          Une fois la publication effective, <Strong>il vous sera toujours possible de modifier vos adresses</Strong> afin de les mettre à jour.
        </Text>

        {!isBALCertified && (
          <Alert
            intent='warning'
            title='Toutes vos adresses ne sont pas certifiées'
            marginY={16}
          >
            <Text is='div' color='muted' marginTop={8}>
              Nous vous recommandons de certifier la <Strong>totalité de vos adresses</Strong>.
            </Text>
            <Text is='div' color='muted' marginTop={8}>
              Une adresse certifiée est déclarée <Strong>authentique par la mairie</Strong>, ce qui <Strong>renforce la qualité de la Base Adresse Locale et facilite sa réutilisation</Strong>.
            </Text>
            <Text is='div' color='muted' marginTop={8}>
              Vous êtes cependant libre de <Strong>publier maintenant et certifier vos adresses plus tard</Strong>.
            </Text>
            <Text is='div' color='muted' marginTop={8}>
              Notez qu’il est possible de certifier la totalité de vos adresses depuis le menu « Paramètres ».
            </Text>
          </Alert>
        )}
      </Pane>

      <Link href={csvUrl} display='flex' marginTop='1em'>
        Télécharger vos adresses au format CSV
        <DownloadIcon marginLeft='.5em' marginTop='3px' />
      </Link>
    </>
  )
}

ReadyToPublishDialog.propTypes = {
  baseLocaleId: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired
}

export default ReadyToPublishDialog
