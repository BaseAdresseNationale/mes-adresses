import {useCallback, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'
import {groupBy, remove} from 'lodash'

import {getVoies} from '@/lib/bal-api'

import VoieRow from '@/components/validateur-report/voie-row'

function ValidateurReport({rows, baseLocaleID}) {
  const [voies, setVoies] = useState()
  const [rowsByVoie, setRowsByVoie] = useState({})

  const getBalVoies = useCallback(async () => {
    try {
      const voiesList = await getVoies(baseLocaleID)
      setVoies(voiesList)
    } catch {
      console.log('Impossible de récupérer la liste des voies')
    }
  }, [baseLocaleID])

  useEffect(() => {
    getBalVoies()
  }, [getBalVoies])

  useEffect(() => {
    if (voies) {
      const rowsByVoies = groupBy(rows, row => row.rawValues.voie_nom)
      const sanitizedRowByVoies = {}

      // Create a new object, grouped by voies names
      Object.keys(rowsByVoies).forEach(nomVoie => {
        const rowsWithAlerts = rowsByVoies[nomVoie].filter(row => {
          remove(row.errors, error => error.level === 'I') // Remove unusefull "information" type alerts
          return row.errors.length > 0
        })

        const rowWithVoieAlerts = rowsWithAlerts.filter(row => !row.parsedValues.numero)
        const numerosWithAlerts = rowsWithAlerts.filter(row => row.parsedValues.numero).map(numero => ({address: numero.parsedValues, alerts: numero.errors}))

        // For each voie, add voie's id, it's own alerts list and it's numeros with alerts list
        sanitizedRowByVoies[nomVoie] = {
          voieId: voies.find(voie => voie.nom === nomVoie)?._id,
          voieAlerts: rowWithVoieAlerts.length > 0 ? rowWithVoieAlerts[0].errors : [],
          numerosWithAlerts
        }
      })
      setRowsByVoie(sanitizedRowByVoies)
    }
  }, [rows, voies])

  return (
    <Pane display='flex' flexDirection='column' gap={12}>
      {Object.keys(rowsByVoie).map(voie => {
        return <VoieRow key={voie} nomVoie={voie} voie={rowsByVoie[voie]} />
      })}
    </Pane>
  )
}

ValidateurReport.propTypes = {
  baseLocaleID: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired
}

export default ValidateurReport
