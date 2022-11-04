import {useState, useContext} from 'react'
import {Pane, Heading, Dialog, Button, Text, Alert, EndorsedIcon, WarningSignIcon, LightbulbIcon, ChevronUpIcon, ChevronDownIcon, BanCircleIcon} from 'evergreen-ui'

import BalDataContext from '@/contexts/bal-data'

import ProgressBar from '@/components/progress-bar'
import Counter from '@/components/counter'

function CertificationInfos() {
  const {certifyAllNumeros, reloadBaseLocale, baseLocale} = useContext(BalDataContext)
  const [isDialogShown, setIsDialogShown] = useState(false)
  const [isInfosShown, setIsInfosShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {nbNumeros, nbNumerosCertifies} = baseLocale
  const percentCertified = Math.round((nbNumerosCertifies * 100) / nbNumeros)

  const handleCertification = async () => {
    setIsDialogShown(false)
    setIsInfosShown(false)
    setIsLoading(true)

    await certifyAllNumeros()
    await reloadBaseLocale()

    setIsLoading(false)
  }

  const handleClose = () => {
    setIsDialogShown(false)
    setIsInfosShown(false)
  }

  return (
    <>
      {!baseLocale.isAllCertified && nbNumerosCertifies > 0 && (
        <>
          <Pane textAlign='center' paddingTop={30}>
            <Heading>Nombre d’adresses certifiées</Heading>
          </Pane>

          <ProgressBar percent={percentCertified} />

          <Pane display='flex' justifyContent='center'>
            <Counter
              label='Adresses certifiées'
              value={nbNumerosCertifies}
              color='#52BD95'
            />
            <Counter
              label='Adresses non-certifiées'
              value={nbNumeros - nbNumerosCertifies}
              color='#FFB020'
            />
          </Pane>

          <Pane>
            <Dialog
              isShown={isDialogShown}
              title='Certification des adresses'
              onCloseComplete={handleClose}
              footer={
                <Pane>
                  <Button
                    onClick={handleClose}
                  >
                    Annuler
                  </Button>
                  <Button
                    isLoading={isLoading}
                    appearance='primary'
                    iconAfter={EndorsedIcon}
                    marginLeft={15}
                    onClick={handleCertification}
                  >
                    Certifier toutes les adresses de ma commune
                  </Button>
                </Pane>
              }
            >
              <Pane>
                <Pane
                  display='flex'
                  alignItems='center'
                >
                  <WarningSignIcon
                    size={65}
                    margin={20}
                    color='warning'
                  />
                  <Text size={500}>
                    Vous vous apprêtez à certifier <b>{nbNumeros - nbNumerosCertifies}</b> adresses de votre commune, <b> cette action ne peut pas être annulée</b>
                  </Text>
                </Pane>
              </Pane>
            </Dialog>

            <Pane textAlign='center'>
              <Button
                iconBefore={LightbulbIcon}
                iconAfter={isInfosShown ? ChevronUpIcon : ChevronDownIcon}
                appearance='minimal'
                onClick={() => setIsInfosShown(!isInfosShown)}
              >
                En savoir plus sur la certification
              </Button>
            </Pane>
          </Pane>
        </>
      )}

      {isInfosShown && (
        <Pane paddingTop={15}>
          <Alert>
            <Heading size={400}>
              Pour faciliter la réutilisation des adresses, <u>il est conseillé de les certifier</u>.
            </Heading>
            <br />
            <Text>
              Il est tout à fait possible de publier une Base Adresse Locale dont l’ensemble des <u>numéros n’ont pas encore été vérifiés : ils doivent rester non-certifiés.</u>
              <br />
            </Text>
            <Pane paddingTop={15}>
              <Text>
                En revanche, les numéros qui auront été authentifiés par la commune <u>devront être certifiés</u>, qu’ils soient nouvellement crées par la commune ou que leur correspondance avec la liste officielle qui ressort du Conseil municipal, soit avérée.
              </Text>
            </Pane>
            <Heading paddingY={15}>
              Toutes les adresses de votre commune ont été vérifiées ?
            </Heading>
            <Pane>
              <Text>
                Si vous avez déjà procédé à la vérification de toutes les adresses de votre commune, cliquez sur le bouton «certifier mes adresses».
              </Text>
            </Pane>
            <Pane
              display='flex'
              justifyContent='end'
              paddingTop={15}
            >
              <Button
                isLoading={isLoading}
                intent='infos'
                appearance='primary'
                onClick={() => setIsDialogShown(true)}
              >
                Certifier mes adresses
              </Button>
            </Pane>
          </Alert>
        </Pane>
      )}

      {nbNumerosCertifies === 0 && (
        <Pane
          display='flex'
          alignItems='center'
          border='4px solid #2053b3'
          borderRadius='10px'
          padding='1em'
          marginY='1em'
          marginX='4px'
        >
          <BanCircleIcon color='danger' size={40} />
          <Text size={600} paddingLeft={20}>
            Aucune adresse n’est certifiée par la commune
          </Text>
        </Pane>
      )}

      {baseLocale.isAllCertified && (
        <Pane
          display='flex'
          alignItems='center'
          border='4px solid #2053b3'
          borderRadius='10px'
          padding='1em'
          marginY='1em'
          marginX='4px'
        >
          <EndorsedIcon color='success' size={50} />
          <Text size={600} paddingLeft={20}>
            Toutes les adresses sont certifiées par la commune
          </Text>
        </Pane>
      )}
    </>
  )
}

export default CertificationInfos
