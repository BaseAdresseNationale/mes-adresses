import fetch from 'isomorphic-unfetch'

const {API_URL} = process.env

async function request(url, options) {
  const res = await fetch(`${API_URL}/${url}`, options)
  return res.json()
}

export function list() {
  return request('/bases-locales')
}
