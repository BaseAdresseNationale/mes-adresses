import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'
import {groupBy, remove} from 'lodash'

import VoieRow from '@/components/validateur-report/voie-row'

function ValidateurReport({rows, voies, baseLocaleId}) {
  const sanitizedRowsByVoies = {}

  if (voies) {
    const rowsByVoies = groupBy(rows, row => row.rawValues.voie_nom)

    // Create a new object, grouped by voies names
    Object.keys(rowsByVoies).forEach(nomVoie => {
      const rowsWithAlerts = rowsByVoies[nomVoie].filter(row => {
        remove(row.errors, error => error.level === 'I') // Remove unusefull "information" type alerts
        return row.errors.length > 0
      })

      const rowWithVoieAlerts = rowsWithAlerts.filter(row => !row.parsedValues.numero)
      const numerosWithAlerts = rowsWithAlerts.filter(row => row.parsedValues.numero).map(numero => ({address: numero.parsedValues, alerts: numero.errors}))

      // For each voie, add voie's id, it's own alerts list and it's numeros with alerts list
      sanitizedRowsByVoies[nomVoie] = {
        voieId: voies.find(voie => voie.nom === nomVoie)?._id,
        voieAlerts: rowWithVoieAlerts.length > 0 ? rowWithVoieAlerts[0].errors : [],
        numerosWithAlerts
      }
    })
  }

  return (
    <Pane display='flex' flexDirection='column' gap={12}>
      {Object.keys(sanitizedRowsByVoies).map(voie => {
        return <VoieRow key={voie} nomVoie={voie} voie={sanitizedRowsByVoies[voie]} baseLocaleId={baseLocaleId} />
      })}
    </Pane>
  )
}

ValidateurReport.propTypes = {
  baseLocaleId: PropTypes.string.isRequired,
  voies: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}

export default ValidateurReport
