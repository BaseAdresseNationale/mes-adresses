import {useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {groupBy, filter} from 'lodash'

import VoieRow from '@/components/validateur-report/voie-row'

const validAlertSchemas = new Set(['voie_nom', 'numero', 'suffixe'])

function ValidateurReport({rows, voies, onRedirect}) {
  const sanitizedRowsByVoies = useMemo(() => {
    const finalObj = {}

    const rowsByVoies = groupBy(rows, row => row.rawValues.voie_nom)

    // Create a new object, grouped by voies names
    Object.keys(rowsByVoies).forEach(nomVoie => {
      const rowsWithAlerts = rowsByVoies[nomVoie].filter(row => {
        row.errors = filter(row.errors, error => validAlertSchemas.has(error.schemaName)) // Keep usefull alerts only
        return row.errors.length > 0
      })

      const rowWithVoieAlerts = rowsWithAlerts.filter(row => !row.parsedValues.numero)
      const numerosWithAlerts = rowsWithAlerts.filter(row => row.parsedValues.numero).map(numero => ({address: numero.parsedValues, alerts: numero.errors}))

      // For each voie, add voie's id, it's own alerts list and it's numeros with alerts list
      if (rowWithVoieAlerts.length > 0 || numerosWithAlerts.length > 0) {
        finalObj[nomVoie] = {
          voieId: voies.find(voie => voie.nom === nomVoie)._id,
          voieAlerts: rowWithVoieAlerts.length > 0 ? rowWithVoieAlerts[0].errors : [],
          numerosWithAlerts
        }
      }
    })

    return finalObj
  }, [rows, voies])

  return Object.keys(sanitizedRowsByVoies).length > 0 && (
    <Pane display='flex' flexDirection='column' justifyContent='center' gap={12}>
      <Heading is='h3' fontSize={17} marginBottom={6}>Anomalies détectées</Heading>
      {Object.keys(sanitizedRowsByVoies).map(voie => (
        <VoieRow
          key={sanitizedRowsByVoies[voie].voieId}
          nomVoie={voie}
          voie={sanitizedRowsByVoies[voie]}
          onRedirect={onRedirect}
        />
      ))}
    </Pane>
  )
}

ValidateurReport.propTypes = {
  voies: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  onRedirect: PropTypes.func.isRequired
}

export default ValidateurReport
