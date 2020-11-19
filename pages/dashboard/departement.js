import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane, Button} from 'evergreen-ui'
import {flatten, groupBy, uniq} from 'lodash'
import Router from 'next/router'

import {getContoursCommunes, listBALByCodeDepartement} from '../../lib/bal-api'
import {getDepartement} from '../../lib/geo-api'
import {getBALByStatus} from '../../lib/bases-locales'

import Counter from '../../components/dashboard/counter'
import Map from '../../components/dashboard/map'
import PieChart from '../../components/dashboard/charts/pie-chart'
import CommuneBALList from '../../components/dashboard/commune-bal-list'
import {expandWithPublished} from '../../helpers/bases-locales'
import Header from '../../components/header'

const Departement = ({departement, filteredCommunesInBAL, basesLocalesDepartement, basesLocalesDepartementWithoutTest, BALGroupedByCommune, contoursCommunes}) => {
  const {nom, code} = departement
  const numberCommunesWithoutTest = uniq(basesLocalesDepartementWithoutTest.map(({communes}) => communes)).length

  const BALByStatus = getBALByStatus(basesLocalesDepartementWithoutTest)

  return (
    <Pane height='100vh' display='flex' flexDirection='column'>
      <Header />
      <Heading size={600} marginY={8} textAlign='center'>
        Tableau de bord des Bases Adresse Locales
      </Heading>

      <Pane display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Heading size={600} marginY={8} textAlign='center'>
          {nom} ({code})
        </Heading>
        <Button
          className='back-button'
          margin={8}
          iconBefore='arrow-left'
          onClick={() => Router.push('/dashboard')}
        >
          Retour France entière
        </Button>
      </Pane>

      {basesLocalesDepartement.length >= 1 ? (
        <>
          <Pane display='flex' flexWrap='wrap'>
            {basesLocalesDepartementWithoutTest.length > 0 && (
              <div className='chart-container'>
                <Pane display='flex' flexDirection='column' alignItems='center' >
                  <Counter
                    label={`${basesLocalesDepartementWithoutTest.length > 1 ? 'Bases Adresses Locales' : 'Base Adresse Locale'}`}
                    value={basesLocalesDepartementWithoutTest.length} />
                  <PieChart height={240} data={BALByStatus} />
                </Pane>
              </div>
            )}

            <div className='chart-container map'>
              {numberCommunesWithoutTest > 0 && (
                <Counter
                  label={`${numberCommunesWithoutTest > 1 ? 'Communes couvertes' : 'Commune couverte'} par une Base Adresse Locale`}
                  value={numberCommunesWithoutTest}
                />
              )}

              <Pane flexGrow={1} width='100%'>
                <Map
                  departement={code}
                  basesLocales={basesLocalesDepartementWithoutTest}
                  contours={contoursCommunes}
                />
              </Pane>
            </div>
          </Pane>

          <Pane>
            {filteredCommunesInBAL.map(({code, nom}) => (
              <CommuneBALList
                key={code}
                nomCommune={nom}
                basesLocales={BALGroupedByCommune[code]}
              />
            ))}
          </Pane>
        </>
      ) : (
        <Heading marginTop={16} textAlign='center' size={600}>
          Aucune Base Adresse Locale
        </Heading>
      )}
      <style jsx>{`
        .chart-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
            margin: 1em;
            padding: 1em;
            min-width: 300px;
            max-height: 400px;
            background-color: #fff;
            box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 2px 4px -2px rgba(67, 90, 111, 0.47);
          }

        .chart-container.map {
          flex: 2;
          padding: 0;
        }  
      `}</style>
    </Pane>
  )
}

Departement.getInitialProps = async ({query}) => {
  const communes = require('@etalab/decoupage-administratif/data/communes.json')
    .filter(c => c.type === 'commune-actuelle')

  const {codeDepartement} = query

  const contoursCommunes = await getContoursCommunes()
  const departement = await getDepartement(codeDepartement)
  const basesLocalesDepartement = await listBALByCodeDepartement(codeDepartement)
  const basesLocalesDepartementWithoutTest = basesLocalesDepartement.filter((({isTest}) => !isTest))

  await expandWithPublished(basesLocalesDepartementWithoutTest)

  const BALAddedOneCodeCommune = flatten(basesLocalesDepartement.map(b => b.communes.map(c => ({...b, commune: c}))))
  const BALGroupedByCommune = groupBy(BALAddedOneCodeCommune, 'commune')

  const filteredCommunesInBAL = communes.filter(({code}) => Object.keys(BALGroupedByCommune).includes(code))

  return {
    departement,
    filteredCommunesInBAL,
    contoursCommunes,
    basesLocalesDepartement,
    basesLocalesDepartementWithoutTest,
    BALGroupedByCommune,
    layout: 'fullscreen'
  }
}

Departement.propTypes = {
  departement: PropTypes.object.isRequired,
  filteredCommunesInBAL: PropTypes.array.isRequired,
  basesLocalesDepartement: PropTypes.array.isRequired,
  basesLocalesDepartementWithoutTest: PropTypes.array.isRequired,
  BALGroupedByCommune: PropTypes.object.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Departement
