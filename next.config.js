const {join} = require('path')
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
  webpack(config, {dev, isServer}) {
    if (!dev && !isServer) {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: join(__dirname, 'reports/bundles.html'),
        defaultSizes: 'gzip'
      }))
    }

    config.node = {
      ...config.node,
      fs: 'empty'
    }

    return config
  }
})
