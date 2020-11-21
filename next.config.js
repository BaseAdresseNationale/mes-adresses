const nextRuntimeDotenv = require('next-runtime-dotenv')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const withConfig = nextRuntimeDotenv({
  public: [
    'BAL_API_URL',
    'GEO_API_URL',
    'ADRESSE_URL',
    'EDITEUR_URL',
    'MES_ADRESSES_URL',
    'ADRESSE_BACKEND_URL'
  ]
})

module.exports = withBundleAnalyzer(
  withConfig({
    webpack(config) {
      config.node = {
        ...config.node,
        fs: 'empty'
      }

      return config
    }
  })
)
