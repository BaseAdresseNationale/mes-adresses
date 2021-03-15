import React, {useState, useEffect} from 'react'
import {Pane, Dialog, Paragraph, Heading, Badge} from 'evergreen-ui'

const INCIDENT_OVH = 'incident-ovh'

function IncidentOvhAlert() {
  const [isShown, setIsShown] = useState(false)

  const handleConfirm = () => {
    localStorage.setItem(INCIDENT_OVH, true)
    setIsShown(false)
  }

  useEffect(() => {
    const wasWelcomed = JSON.parse(localStorage.getItem(INCIDENT_OVH) || false)
    setIsShown(!wasWelcomed)
  }, [])

  return (
    <Dialog
      isShown={isShown}
      intent='info'
      title='Incident majeur 🔥'
      confirmLabel='J’ai compris'
      hasCancel={false}
      onConfirm={handleConfirm}
    >
      <Paragraph textAlign='center'>
        Notre éditeur «Mes Adresses» est <strong>à nouveau disponible</strong>.
      </Paragraph>

      <Paragraph marginTop='1em'>
        Si les Bases Adresses Locales publiées <strong>ont bien été récupérées et sauvegardées dans la Base Adresse Nationale</strong>, ce n’est malheureusement pas le cas de celles en mode <Badge color='neutral' margin='auto'>Brouillon</Badge> ou <Badge color='blue' margin='auto'>Prête à être publiée</Badge>.
      </Paragraph>

      <Pane marginY={16}>
        <Heading size={600} textAlign='center'>Comment reprendre votre adressage ?</Heading>
        <Heading size={500} marginTop='1em'>• Si vous aviez déjà publié votre Base Adresse Locale</Heading>
        <Paragraph marginLeft={16}>
          Vos adresses ont pu être récupérées depuis la Base Adresse Nationale. Vous pouvez reprendre leur édition en <strong>créant une nouvelle Base Adresse Locale</strong> qui reprendra <strong>l’ensemble des données qui avaient été publiées</strong>.
        </Paragraph>
        <Paragraph marginLeft={16} marginTop={8}>
          Cependant, certaines informations font partie des données non-recouvrables comme les <strong>compléments de voie</strong> et <strong>les tracés d’assistance</strong> à la numérotation métrique.
        </Paragraph>

        <Heading size={500} marginTop='1em'>• Si votre Base Adresse Locale était en cours d’édition</Heading>
        <Paragraph marginLeft={16}>
          Vos adresses n’ont hélas pu être récupérées, il est donc nécessaire de <strong>recréer une Base Adresse Locale</strong>.
        </Paragraph>

        <div className='divider' />

        <Paragraph marginTop='2em' textAlign='center'>
          Notre équipe a fait le maximum pour récupérer <strong>toutes les données qui pouvaient l’être</strong>. Cet incident exceptionnel, <strong>indépendant de nos services</strong>, est désormais pleinement résolu.
        </Paragraph>
        <Paragraph marginTop='1em' textAlign='center'>
          Nous restons à votre disposition afin de vous accompagner au mieux lors de votre adressage.
        </Paragraph>
      </Pane>

      <style jsx>{`
        .divider {
          margin: 1em auto;
          width: 80%;
          border-top: 1px solid #edf0f2;
        }
        `}</style>
    </Dialog>
  )
}

export default IncidentOvhAlert
