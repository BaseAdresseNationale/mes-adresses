import qs from 'querystring'
import fetch from 'isomorphic-unfetch'

const {GEO_API_URL} = process.env

async function request(url, options) {
  const res = await fetch(`${GEO_API_URL}${url}`, options)
  return res.json()
}

function isCodeDep(token) {
  return ['2A', '2B'].includes(token) || token.match(/^\d{2,3}$/)
}

export function searchCommunes(search, options = {}) {
  const query = {
    nom: search
  }

  const codeDep = search.split(' ').find(isCodeDep)
  if (codeDep) {
    query.codeDepartement = codeDep
  }

  return request(`/communes?${qs.stringify({
    ...options,
    ...query
  })}`)
}

export function getCommune(code, options = {}) {
  return request(`/communes/${code}?${qs.stringify(options)}`)
}
