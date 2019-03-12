require('dotenv').config()
const {join} = require('path')

const {API_BAL} = process.env

module.exports = {
  target: 'serverless',

  env: {
    API_BAL
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
