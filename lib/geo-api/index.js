import fetch from 'isomorphic-unfetch'

const {GEO_API_URL} = process.env

async function request(url, options) {
  const res = await fetch(url instanceof URL ? url : `${GEO_API_URL}/${url}`, options)
  return res.json()
}

function isCodeDep(token) {
  return ['2A', '2B'].includes(token) || token.match(/^\d{2,3}$/)
}

export function searchCommunes(value, options) {
  const url = new URL(`${GEO_API_URL}/communes`)

  url.searchParams.append('nom', value)

  for (const [key, value] of Object.entries(options)) {
    url.searchParams.append(key, value)
  }

  const codeDep = value.split(' ').find(isCodeDep)
  if (codeDep) {
    url.searchParams.set('codeDepartement', codeDep)
  }

  return request(url)
}
