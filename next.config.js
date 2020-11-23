const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  webpack(config, {webpack}) {
    config.node = {
      ...config.node,
      fs: 'empty'
    }

    config.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fr/))

    return config
  }
})
