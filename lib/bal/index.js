import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: {API_URL}
} = getConfig()

async function request(url, options) {
  const res = await fetch(`${API_URL}/${url}`, options)
  return res.json()
}

export function list() {
  return request('/bases-locales')
}
