import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Strong, Button, Alert, Text, Link, EnvelopeIcon} from 'evergreen-ui'

function isEmail(email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(String(email).toLowerCase())
}

const AnnuaireServicePublic = React.memo(() => (
  <>
    <Text is='div' marginTop={8} size={400}>
      Nous utilisons l’adresse email référencée sur <Link href='https://lannuaire.service-public.fr/'>lannuaire.service-public.fr</Link> afin d’envoyer le code d’authentification.
    </Text>
    <Text is='div' marginTop={8} size={400}>
      Nous vous invitons à vous rendre sur <Link href='https://lannuaire.service-public.fr/'>lannuaire.service-public.fr</Link>,
      puis consulter la fiche annuaire de votre commune où vous trouverez, en bas de page, un lien <Strong whiteSpace='nowrap' fontStyle='italic'>« Demander une mise à jour de cette page »</Strong>, permettant de mettre à jour l’adresse email de la commune.
    </Text>
  </>
))

function CodeEmail({emailCommune, handleStrategy}) {
  const isValidEmail = isEmail(emailCommune)
  return (
    <>
      <Pane>
        <Heading is='h5' marginBottom={8}>Authentifier la mairie</Heading>
        <Button
          disabled={!emailCommune || !isValidEmail}
          cursor={emailCommune ? 'pointer' : 'not-allowed'}
          appearance='primary'
          height={60}
          iconBefore={EnvelopeIcon}
          onClick={handleStrategy}
        >
          Recevoir un code d’habilitation
        </Button>
      </Pane>
      {emailCommune ? (
        isValidEmail ? (
          <>
            <Text is='div' marginTop={8} size={400}>
              Un code d’habilitation vous sera envoyé à l’adresse : <Strong whiteSpace='nowrap'>{emailCommune}</Strong>
            </Text>

            <Text is='div' marginTop={8} size={400}>
              Vous serez ensuite invité à taper ce code, confirmant ainsi la gestion de cette Base Adresse Locale par un employé de mairie.
            </Text>

            <Alert title='Cette adresse email est incorrecte ou obsolète ?' marginTop={16} textAlign='left'>
              <AnnuaireServicePublic />
            </Alert>
          </>
        ) : (
          <Alert intent='danger' title='Adresse email invalide' marginTop={16} textAlign='left'>
            <Text is='div' marginTop={8} size={400}>
              L’adresse email renseignée : <Strong>{emailCommune}</Strong>, ne peut pas être utilisée afin d’envoyer un code d’authentification.
            </Text>
            <AnnuaireServicePublic />
          </Alert>
        )) : (
        <Alert intent='danger' title='Aucune adresse email connue pour cette commune' marginTop={16} textAlign='left'>
          <AnnuaireServicePublic />
        </Alert>
      )}
    </>
  )
}

CodeEmail.propTypes = {
  emailCommune: PropTypes.string,
  handleStrategy: PropTypes.func
}

export default CodeEmail
