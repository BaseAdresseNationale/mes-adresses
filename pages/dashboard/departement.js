import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'
import {flatten, sortBy} from 'lodash'

import {listBALByCodeDepartement} from '@/lib/bal-api'
import {getDepartement, searchCommunesByCode} from '@/lib/geo-api'
import {getBALByStatus} from '@/lib/bases-locales'
import {normalizeSort} from '@/lib/normalize'

import DashboardLayout from '@/layouts/dashboard'

import Counter from '@/components/dashboard/counter'
import PieChart from '@/components/dashboard/charts/pie-chart'
import CommuneBALList from '@/components/dashboard/commune-bal-list'
import PublishedBalStats from '@/components/dashboard/published-bal-stats'

function Departement({departement, filteredCommunesInBAL, basesLocalesDepartement, BALGroupedByCommune, stats, basesLocalesStatsByStatus, countCommunesActuelles}) {
  const {nom, code} = departement
  const {nbCommunes, nbVoies, nbLieuxDits, nbNumeros, nbNumerosCertifies} = stats

  const BALByStatus = getBALByStatus(basesLocalesStatsByStatus)
  const countPublishedBAL = BALByStatus.find(({label}) => label === 'Publiée' || label === 'Publiées')

  const mapData = {
    departement: code,
    basesLocales: basesLocalesDepartement
  }

  return (
    <DashboardLayout backButton title={`Tableau de bord de l'éditeur Mes Adresses - ${nom} (${code})`} mapData={mapData}>
      {basesLocalesDepartement.length > 0 ? (
        <Pane display='grid' gridGap='2em' padding={8}>

          {countPublishedBAL?.values > 0 && (
            <PublishedBalStats stats={{nbCommunes, nbVoies, nbLieuxDits, nbNumeros, nbNumerosCertifies}} />
          )}

          {countCommunesActuelles > 0 && (
            <Counter
              label={`${countCommunesActuelles > 1 ? 'Communes couvertes' : 'Commune couverte'} par une Base Adresse Locale`}
              value={countCommunesActuelles}
            />
          )}

          <Pane display='flex' flexDirection='column' alignItems='center' >
            <Counter
              label={`${basesLocalesDepartement.length > 1 ? 'Bases Adresses Locales' : 'Base Adresse Locale'}`}
              value={basesLocalesDepartement.length} />
            <PieChart height={240} data={BALByStatus} />
          </Pane>

          <Pane>
            <Heading size={500} marginY={8}>Liste des Bases Adresses Locales</Heading>
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

export async function getServerSideProps({query}) {
  const {codeDepartement} = query

  const departement = await getDepartement(codeDepartement)
  const {basesLocales, BALGroupedByCommune, stats, codesCommunes} = await listBALByCodeDepartement(codeDepartement)

  const communesActuelles = flatten(await Promise.all(codesCommunes.map(async c => {
    const communes = await searchCommunesByCode(c)
    return communes
  })))

  const filteredCommunesInBAL = sortBy(communesActuelles, [({nom}) => normalizeSort(nom), 'code'])
    .filter(({code}) => codesCommunes.includes(code))

  return {
    props: {
      departement,
      filteredCommunesInBAL,
      basesLocalesDepartement: basesLocales,
      BALGroupedByCommune,
      stats: stats.basesLocalesStats,
      basesLocalesStatsByStatus: stats.basesLocalesStatsByStatus,
      countCommunesActuelles: communesActuelles.length
    }
  }
}

Departement.propTypes = {
  departement: PropTypes.object.isRequired,
  filteredCommunesInBAL: PropTypes.array.isRequired,
  basesLocalesDepartement: PropTypes.array.isRequired,
  BALGroupedByCommune: PropTypes.object.isRequired,
  basesLocalesStatsByStatus: PropTypes.object.isRequired,
  countCommunesActuelles: PropTypes.number.isRequired,
  stats: PropTypes.object.isRequired
}

export default Departement
