import React, {useEffect, useContext} from 'react'
import {Pane} from 'evergreen-ui'

import {getNumeros, getVoie} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'

import useHelp from '@/hooks/help'
import useFormState from '@/hooks/useFormState'

import NumeroEditor from '@/components/bal/numero-editor'
import VoieHeading from '@/components/voie/voie-heading'
import NumerosList from '@/components/voie/numeros-list'
import {CommuneType} from '@/types/commune'
import {getBaseEditorProps} from '@/layouts/editor'
// Import BALRecoveryContext from '@/contexts/bal-recovery'

interface VoiePageProps {
  commune: CommuneType;
}

function VoiePage({commune}: VoiePageProps) {
  const {isFormOpen, handleEditing, editedNumero, reset} = useFormState()
  // Const {setIsRecoveryDisplayed} = useContext(BALRecoveryContext)

  useHelp(3)

  const {token} = useContext(TokenContext)
  const {voie, numeros, reloadNumeros} = useContext(BalDataContext)

  // Load protected fields (ex: 'comment')
  useEffect(() => {
    if (token) {
      reloadNumeros()
    }
  }, [token, reloadNumeros])

  return (
    <>
      <VoieHeading voie={voie} />

      <Pane position='relative' display='flex' flexDirection='column' height='100%' width='100%' overflow='hidden'>
        {isFormOpen && (
          <NumeroEditor
            hasPreview
            initialVoieId={voie._id}
            initialValue={editedNumero}
            commune={commune}
            closeForm={reset}
          />
        )}

        <NumerosList
          token={token}
          voieId={voie._id}
          numeros={numeros}
          handleEditing={handleEditing}
        />
      </Pane>
    </>
  )
}

export async function getServerSideProps({params}) {
  const {idVoie, balId} = params
  try {
    const {baseLocale, commune, voies, toponymes} = await getBaseEditorProps(balId)
    const voie = await getVoie(idVoie)
    const numeros = await getNumeros(voie._id)

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        voie,
        numeros
      }
    }
  } catch {
    return {
      error: {
        statusCode: 404
      }
    }
  }
}

export default VoiePage
