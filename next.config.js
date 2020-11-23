const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  webpack(config) {
    config.node = {
      ...config.node,
      fs: 'empty'
    }

    return config
  }
})
