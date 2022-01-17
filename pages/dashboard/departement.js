import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'
import {flatten, groupBy, uniq} from 'lodash'

import {getContoursCommunes, listBALByCodeDepartement} from '../../lib/bal-api'
import {getDepartement, searchCommunesByCode} from '../../lib/geo-api'
import {getBALByStatus} from '../../lib/bases-locales'

import Counter from '../../components/dashboard/counter'
import PieChart from '../../components/dashboard/charts/pie-chart'
import CommuneBALList from '../../components/dashboard/commune-bal-list'
import DashboardLayout from '../../components/layout/dashboard'

function Departement({departement, filteredCommunesInBAL, basesLocalesDepartementWithoutDemo, BALGroupedByCommune, contoursCommunes}) {
  const {nom, code} = departement
  let nbNumerosCertifies = 0

  const codesCommunes = new Set(filteredCommunesInBAL.map(({code}) => code))
  const communesWithoutTest = uniq(flatten(basesLocalesDepartementWithoutDemo.map(({communes}) => communes)))
  const countCommunesActuelles = communesWithoutTest.filter(c => codesCommunes.has(c)).length

  const BALByStatus = getBALByStatus(basesLocalesDepartementWithoutDemo)
  basesLocalesDepartementWithoutDemo.forEach(bal => {
    nbNumerosCertifies += bal.nbNumerosCertifies
  })

  const mapData = {
    departement: code,
    basesLocales: basesLocalesDepartementWithoutDemo,
    contours: contoursCommunes
  }

  return (
    <DashboardLayout backButton title={`Tableau de bord de l'éditeur Mes Adresses - ${nom} (${code})`} mapData={mapData}>
      {basesLocalesDepartementWithoutDemo.length > 0 ? (
        <Pane display='grid' gridGap='2em' padding={8}>
          {countCommunesActuelles > 0 && (
            <Counter
              label={`${countCommunesActuelles > 1 ? 'Communes couvertes' : 'Commune couverte'} par une Base Adresse Locale`}
              value={countCommunesActuelles}
            />
          )}
          {nbNumerosCertifies > 0 && (
            <Counter
              label={`${nbNumerosCertifies > 1 ? 'Numéros certifiés' : 'Numéro certifié'}`}
              value={nbNumerosCertifies}
            />
          )}

          <Pane display='flex' flexDirection='column' alignItems='center' >
            <Counter
              label={`${basesLocalesDepartementWithoutDemo.length > 1 ? 'Bases Adresses Locales' : 'Base Adresse Locale'}`}
              value={basesLocalesDepartementWithoutDemo.length} />
            <PieChart height={240} data={BALByStatus} />
          </Pane>

          <Pane>
            <Heading size={500} marginY={8}>Liste des Base Adresse Locale</Heading>
            {filteredCommunesInBAL.map(({code, nom}, key) => (
              <Pane key={code} background={key % 2 ? 'tin1' : 'tint2'}>
                <CommuneBALList
                  nomCommune={nom}
                  basesLocales={BALGroupedByCommune[code]}
                />
              </Pane>
            ))}
          </Pane>
        </Pane>
      ) : (
        <Heading marginTop={16} textAlign='center' size={600}>
          Aucune Base Adresse Locale
        </Heading>
      )}
    </DashboardLayout>
  )
}

Departement.getInitialProps = async ({query}) => {
  const {codeDepartement} = query

  const contoursCommunes = await getContoursCommunes()
  const departement = await getDepartement(codeDepartement)
  const basesLocalesDepartement = await listBALByCodeDepartement(codeDepartement)
  const basesLocalesDepartementWithoutDemo = basesLocalesDepartement.filter(b => b.status !== 'demo')

  const BALAddedOneCodeCommune = flatten(basesLocalesDepartementWithoutDemo.map(b => b.communes.map(c => ({...b, commune: c}))))
  const BALGroupedByCommune = groupBy(BALAddedOneCodeCommune, 'commune')

  const communesActuelles = flatten(await Promise.all(Object.keys(BALGroupedByCommune).map(async c => {
    const communes = await searchCommunesByCode(c)
    return communes
  })))

  const filteredCommunesInBAL = communesActuelles.filter(({code}) => Object.keys(BALGroupedByCommune).includes(code))

  return {
    departement,
    filteredCommunesInBAL,
    contoursCommunes,
    basesLocalesDepartementWithoutDemo,
    BALGroupedByCommune,
    layout: 'fullscreen'
  }
}

Departement.propTypes = {
  departement: PropTypes.object.isRequired,
  filteredCommunesInBAL: PropTypes.array.isRequired,
  basesLocalesDepartementWithoutDemo: PropTypes.array.isRequired,
  BALGroupedByCommune: PropTypes.object.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Departement
