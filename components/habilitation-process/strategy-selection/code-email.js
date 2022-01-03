import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Strong, Button, Alert, Text, OrderedList, Link, EnvelopeIcon, ListItem} from 'evergreen-ui'

function isEmail(email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  return regexp.test(String(email).toLowerCase())
}

const AnnuaireServicePublic = React.memo(() => (
  <OrderedList>
    <ListItem>Rendez vous sur <Link href='https://lannuaire.service-public.fr/'>lannuaire.service-public.fr</Link></ListItem>
    <ListItem>Consultez la fiche annuaire de votre commune</ListItem>
    <ListItem>Cliquer sur le lien «Demander une mise à jour de cette page», visible en bas de page</ListItem>
  </OrderedList>
))

function CodeEmail({emailCommune, handleStrategy}) {
  const isValidEmail = isEmail(emailCommune)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const handleAlertOpening = () => {
    setIsAlertOpen(!isAlertOpen)
  }

  return (
    <>
      <Pane>
        <Heading is='h5' marginBottom={8}>Authentifier la mairie</Heading>
        <Button
          disabled={!emailCommune || !isValidEmail}
          cursor={emailCommune ? 'pointer' : 'not-allowed'}
          appearance='primary'
          onClick={handleStrategy}
          display='flex'
          flexDirection='column'
          width={280}
          height={72}
          gap={6}
        >
          <EnvelopeIcon size={30} />
          Recevoir un code d’habilitation
        </Button>
      </Pane>

      {emailCommune ? (
        isValidEmail ? (
          <>
            <Text is='div' marginTop={8} size={400} display='flex' flexDirection='column'>
              Un code d’habilitation vous sera envoyé à l’adresse : <Strong whiteSpace='nowrap'>{emailCommune}</Strong>
            </Text>

            <Text is='div' marginTop={8} size={400}>
              Vous serez ensuite invité à taper ce code, confirmant ainsi la gestion de cette Base Adresse Locale par un(e) employé(e) de mairie.
            </Text>

            <Alert title='Cette adresse email est incorrecte ou obsolète ?' width='100%' marginTop={16} textAlign='left' overflow='auto'>
              <Text is='div' textAlign='center' textDecoration='underline' cursor='pointer' marginTop={8} onClick={handleAlertOpening}><Strong>Découvrez la marche à suivre</Strong></Text>

              {isAlertOpen && (
                <AnnuaireServicePublic />
              )}
            </Alert>
          </>
        ) : (
          <Alert intent='danger' title='Adresse email invalide' marginTop={16} textAlign='left'>
            <Text is='div' marginTop={8} size={400}>
              L’adresse email renseignée : <Strong>{emailCommune}</Strong>, ne peut pas être utilisée afin d’envoyer un code d’authentification.
            </Text>
            <Text is='div' textAlign='center' textDecoration='underline' cursor='pointer' onClick={handleAlertOpening}><Strong>Découvrez la marche à suivre</Strong></Text>

            {isAlertOpen && (
              <AnnuaireServicePublic />
            )}
          </Alert>
        )
      ) : (
        <Alert intent='danger' title='Aucune adresse email connue pour cette commune' marginTop={16} textAlign='left' overflow='auto'>
          <Text is='div' textAlign='center' textDecoration='underline' cursor='pointer' onClick={handleAlertOpening}><Strong fontSize={12}>Découvrez la marche à suivre</Strong></Text>

          {isAlertOpen && (
            <AnnuaireServicePublic />
          )}
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
