const nextRuntimeDotenv = require('next-runtime-dotenv')

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

module.exports = withConfig({
  webpack(config) {
    config.node = {
      ...config.node,
      fs: 'empty'
    }

    return config
  }
})
