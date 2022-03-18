import {useState, useEffect, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {uniq} from 'lodash'
import {Pane, Dialog, Alert, Paragraph, Strong} from 'evergreen-ui'

import {getCommune} from '@/lib/geo-api'

import LocalStorageContext from '@/contexts/local-storage'

import useError from '@/hooks/error'

import BaseLocaleCard from '@/components/base-locale-card'
import DeleteWarning from '@/components/delete-warning'

function AlertPublishedBAL({isShown, userEmail, onClose, onConfirm, basesLocales, updateBAL}) {
  const {removeBAL} = useContext(LocalStorageContext)

  const [communeLabel, setCommuneLabel] = useState('cette commune')
  const [isLoading, setIsLoading] = useState(false)
  const uniqCommunes = uniq(...basesLocales.map(({commune}) => commune))
  const [toRemove, setToRemove] = useState(null)

  const [setError] = useError(null)

  useEffect(() => {
    const fetchCommune = async code => {
      const commune = await getCommune(code)
      if (commune) {
        setCommuneLabel(commune.nom)
      }
    }

    fetchCommune(basesLocales[0].commune)
  }, [basesLocales])

  const onBalSelect = bal => {
    if (bal.commune) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.commune}`,
        `/bal/${bal._id}/communes/${bal.commune}`
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }

  const onRemove = useCallback(async () => {
    try {
      await removeBAL(toRemove)
      setToRemove(null)
      updateBAL()
    } catch (error) {
      setError(error.message)
    }
  }, [toRemove, updateBAL, removeBAL, setError])

  const handleConfirmation = () => {
    setIsLoading(true)
    onConfirm()
  }

  const handleRemove = useCallback((e, balId) => {
    e.stopPropagation()
    setToRemove(balId)
  }, [])

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={(
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer cette Base Adresse Locale ? Cette action est définitive.
          </Paragraph>
        )}
        onCancel={() => setToRemove(null)}
        onConfirm={onRemove}
      />
      <Dialog
        isShown={isShown}
        title={uniqCommunes.length > 1 ? (
          'Vous avez déjà des Bases Adresses Locales pour ces communes'
        ) : (
          `Vous avez déjà créé une Base Adresse Locale pour ${communeLabel}`
        )}
        width='800px'
        confirmLabel={isLoading ? 'En cours de création…' : 'Créer une nouvelle Base Adresse Locale'}
        cancelLabel='Annuler'
        isConfirmLoading={isLoading}
        onConfirm={handleConfirmation}
        onCloseComplete={onClose}
      >
        <Pane>
          <Alert margin='1em'>
            <Paragraph marginTop={8}>
              {uniqCommunes.length > 1 ? (
                <>Il semblerait que vous ayez <Strong>déjà créé</Strong> des Bases Adresses Locales pour ces communes.</>
              ) : (
                <>Une Base Adresse Locale a déjà été créée pour <Strong>{communeLabel}</Strong>.</>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              {basesLocales.length > 1 ? (
                <>Nous vous <Strong>recommandons de continuer l’adressage</Strong> sur une de vos Bases Adresses Locales <Strong>déjà existantes</Strong> parmi la liste ci-dessous.</>
              ) : (
                <>Nous vous <Strong>recommandons de continuer l’adressage</Strong> sur votre Base Adresses Locales <Strong>déjà existante</Strong> ci-dessous.</>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              Pour reprendre votre travail, {basesLocales.length > 1 && <><Strong>sélectionnez une Base Adresse Locale</Strong> puis</>} <Strong>cliquez sur &quot;Gérer&nbsp;mes&nbsp;adresses&quot;</Strong>.
            </Paragraph>
            <Paragraph marginTop={8}>
              Vous pouvez toutefois cliquer sur <Strong>&quot;Créer&nbsp;une&nbsp;nouvelle&nbsp;Base&nbsp;Adresses&nbsp;Locales&quot;</Strong> si vous souhaitez <Strong>recommencer l’adressage</Strong>.
            </Paragraph>
          </Alert>

          {basesLocales.map(bal => (
            <BaseLocaleCard
              key={bal._id}
              isAdmin
              userEmail={userEmail}
              isDefaultOpen={basesLocales.length === 1}
              baseLocale={bal}
              onSelect={() => onBalSelect(bal)}
              onRemove={e => handleRemove(e, bal._id)}
            />
          ))}
        </Pane>
      </Dialog>
    </>
  )
}

AlertPublishedBAL.propTypes = {
  isShown: PropTypes.bool,
  userEmail: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  basesLocales: PropTypes.array.isRequired,
  onConfirm: PropTypes.func.isRequired,
  updateBAL: PropTypes.func.isRequired
}

AlertPublishedBAL.defaultProps = {
  isShown: false
}

export default AlertPublishedBAL
