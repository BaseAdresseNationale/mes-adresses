import ky from 'ky-universal'
import getConfig from 'next/config'

const {
  publicRuntimeConfig: {API_URL}
} = getConfig()

const api = ky.extend({
  prefixUrl: API_URL
})

export function list() {
  return api.get('bases-locales').json()
}
