require('dotenv').config()

const {join} = require('path')

const {
  BAL_API_URL,
  GEO_API_URL
} = process.env

module.exports = {
  target: 'serverless',

  env: {
    BAL_API_URL,
    GEO_API_URL
  },

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
}
